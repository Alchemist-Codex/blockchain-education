// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./access/Ownable.sol";
import "./security/Pausable.sol";
import "./utils/Counters.sol";

/// @title Academic Credentials Smart Contract
/// @notice This contract manages the issuance and verification of academic credentials on the blockchain
/// @dev Inherits from Ownable for access control and Pausable for emergency stops
contract AcademicCredentials is Ownable, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;

    // Structs
    /// @notice Structure to store credential information
    /// @dev Contains all relevant information about an academic credential
    struct Credential {
        uint256 id;                // Unique identifier for the credential
        address institution;       // Address of the issuing institution
        address student;          // Address of the student receiving the credential
        bytes32 certificateHash;  // Hash of the certificate content
        string ipfsHash;          // IPFS hash where the full certificate is stored
        string metadata;          // Additional metadata about the credential
        uint256 timestamp;        // Time when the credential was issued
        bool isRevoked;          // Flag to indicate if the credential has been revoked
    }

    // Mappings
    mapping(uint256 => Credential) private credentials;           // Maps credential ID to Credential struct
    mapping(address => bool) private institutions;               // Maps institution address to their registration status
    mapping(address => uint256[]) private studentCredentials;    // Maps student address to their credential IDs
    mapping(address => uint256[]) private institutionCredentials; // Maps institution address to their issued credential IDs

    // Events
    event InstitutionRegistered(address indexed institution);
    event InstitutionRemoved(address indexed institution);
    event CredentialIssued(
        uint256 indexed credentialId,
        address indexed institution,
        address indexed student,
        bytes32 certificateHash,
        string ipfsHash
    );
    event CredentialRevoked(uint256 indexed credentialId, address indexed institution);

    // Modifiers
    /// @notice Ensures caller is a registered institution
    modifier onlyInstitution() {
        require(institutions[msg.sender], "Caller is not a registered institution");
        _;
    }

    /// @notice Ensures the credential exists
    modifier credentialExists(uint256 credentialId) {
        require(credentials[credentialId].timestamp != 0, "Credential does not exist");
        _;
    }

    /// @notice Initializes the contract with credential IDs starting from 1
    constructor() {
        _credentialIds.increment(); // Start IDs from 1
    }

    // Institution Management
    /// @notice Registers a new academic institution
    /// @param institution Address of the institution to register
    function registerInstitution(address institution) external onlyOwner {
        require(!institutions[institution], "Institution already registered");
        institutions[institution] = true;
        emit InstitutionRegistered(institution);
    }

    /// @notice Removes a registered institution
    /// @param institution Address of the institution to remove
    function removeInstitution(address institution) external onlyOwner {
        require(institutions[institution], "Institution not registered");
        institutions[institution] = false;
        emit InstitutionRemoved(institution);
    }

    /// @notice Checks if an address belongs to a registered institution
    /// @return bool indicating if the address is a registered institution
    function isInstitution(address account) external view returns (bool) {
        return institutions[account];
    }

    // Credential Management
    /// @notice Issues a new academic credential
    /// @dev Only registered institutions can issue credentials
    function issueCredential(
        address student,
        bytes32 certificateHash,
        string calldata ipfsHash,
        string calldata metadata
    ) external onlyInstitution whenNotPaused returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(certificateHash != bytes32(0), "Invalid certificate hash");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");

        uint256 credentialId = _credentialIds.current();
        
        Credential memory newCredential = Credential({
            id: credentialId,
            institution: msg.sender,
            student: student,
            certificateHash: certificateHash,
            ipfsHash: ipfsHash,
            metadata: metadata,
            timestamp: block.timestamp,
            isRevoked: false
        });

        credentials[credentialId] = newCredential;
        studentCredentials[student].push(credentialId);
        institutionCredentials[msg.sender].push(credentialId);

        emit CredentialIssued(
            credentialId,
            msg.sender,
            student,
            certificateHash,
            ipfsHash
        );

        _credentialIds.increment();
        return credentialId;
    }

    /// @notice Revokes a previously issued credential
    /// @dev Only the issuing institution can revoke their own credentials
    function revokeCredential(uint256 credentialId) 
        external 
        onlyInstitution 
        credentialExists(credentialId) 
    {
        Credential storage credential = credentials[credentialId];
        require(credential.institution == msg.sender, "Not the issuing institution");
        require(!credential.isRevoked, "Credential already revoked");

        credential.isRevoked = true;
        emit CredentialRevoked(credentialId, msg.sender);
    }

    // View Functions
    /// @notice Retrieves credential information by ID
    /// @return Credential struct containing all credential information
    function getCredential(uint256 credentialId) 
        external 
        view 
        credentialExists(credentialId) 
        returns (Credential memory) 
    {
        return credentials[credentialId];
    }

    /// @notice Gets all credential IDs associated with a student
    /// @return Array of credential IDs
    function getStudentCredentials(address student) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return studentCredentials[student];
    }

    /// @notice Gets all credential IDs issued by an institution
    /// @return Array of credential IDs
    function getInstitutionCredentials(address institution) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return institutionCredentials[institution];
    }

    // Emergency Functions
    /// @notice Pauses all credential issuance
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resumes credential issuance
    function unpause() external onlyOwner {
        _unpause();
    }

    // Batch Operations
    /// @notice Issues multiple credentials in a single transaction
    /// @dev All input arrays must be of equal length
    function batchIssueCredentials(
        address[] calldata students,
        bytes32[] calldata certificateHashes,
        string[] calldata ipfsHashes,
        string[] calldata metadataArray
    ) external onlyInstitution whenNotPaused returns (uint256[] memory) {
        require(
            students.length == certificateHashes.length &&
            certificateHashes.length == ipfsHashes.length &&
            ipfsHashes.length == metadataArray.length,
            "Array lengths do not match"
        );

        uint256[] memory issuedIds = new uint256[](students.length);

        for (uint256 i = 0; i < students.length; i++) {
            issuedIds[i] = this.issueCredential(
                students[i],
                certificateHashes[i],
                ipfsHashes[i],
                metadataArray[i]
            );
        }

        return issuedIds;
    }
}
