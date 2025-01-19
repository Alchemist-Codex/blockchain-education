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

    // Enhanced Credential struct with additional fields
    /// @notice Structure to store credential information
    /// @dev Contains all relevant information about an academic credential
    struct Credential {
        uint256 id;                // Unique identifier for the credential
        address institution;       // Address of the issuing institution
        address student;          // Address of the student receiving the credential
        bytes32 certificateHash;  // Hash of the certificate content
        string ipfsHash;          // IPFS hash where the full certificate is stored
        bytes32 encryptedMetadata;  // Changed from string to bytes32 for encrypted metadata
        uint256 timestamp;        // Time when the credential was issued
        bool isRevoked;          // Flag to indicate if the credential has been revoked
        string credentialType;    // e.g., "Degree", "Certificate", "Diploma"
        uint256 expiryDate;      // Optional expiry date for the credential
        bytes32 programHash;      // Hash of the program details
    }

    // Additional mappings
    mapping(uint256 => Credential) private credentials;           // Maps credential ID to Credential struct
    mapping(address => bool) private institutions;               // Maps institution address to their registration status
    mapping(address => uint256[]) private studentCredentials;    // Maps student address to their credential IDs
    mapping(address => uint256[]) private institutionCredentials; // Maps institution address to their issued credential IDs
    mapping(bytes32 => bool) private studentCredentialAccess;    // Maps hash of (student, credentialId) to access permission
    mapping(address => mapping(address => bool)) private institutionDelegates; // Institution -> Delegate -> Permission
    mapping(bytes32 => bool) private usedHashes; // Prevent duplicate certificate hashes

    // Enhanced events
    event InstitutionRegistered(address indexed institution, uint256 timestamp);
    event InstitutionRemoved(address indexed institution, uint256 timestamp);
    event CredentialIssued(
        uint256 indexed credentialId,
        address indexed institution,
        address indexed student,
        bytes32 certificateHash,
        string ipfsHash,
        string credentialType,
        uint256 expiryDate
    );
    event CredentialRevoked(
        uint256 indexed credentialId,
        address indexed institution,
        string reason
    );
    event DelegateAdded(address indexed institution, address indexed delegate);
    event DelegateRemoved(address indexed institution, address indexed delegate);

    // Modifiers
    modifier onlyInstitution() {
        require(
            institutions[msg.sender] || institutionDelegates[getInstitutionForDelegate(msg.sender)][msg.sender],
            "Caller is not authorized institution or delegate"
        );
        _;
    }

    modifier credentialExists(uint256 credentialId) {
        require(credentials[credentialId].id != 0, "Credential does not exist");
        _;
    }

    // Functions
    /// @notice Registers an institution to issue credentials
    /// @param institution The address of the institution to register
    function registerInstitution(address institution) external onlyOwner {
        require(!institutions[institution], "Institution already registered");
        require(institution != address(0), "Invalid institution address");
        
        institutions[institution] = true;
        emit InstitutionRegistered(institution, block.timestamp);
    }

    /// @notice Removes an institution from the list of registered institutions
    /// @param institution The address of the institution to remove
    function removeInstitution(address institution) external onlyOwner {
        require(institutions[institution], "Institution not registered");
        institutions[institution] = false;
        emit InstitutionRemoved(institution, block.timestamp);
    }

    /// @notice Adds a delegate to the institution
    /// @param delegate The address of the delegate to add
    function addInstitutionDelegate(address delegate) external {
        require(institutions[msg.sender], "Caller is not an institution");
        require(!institutionDelegates[msg.sender][delegate], "Delegate already registered");
        require(delegate != address(0), "Invalid delegate address");

        institutionDelegates[msg.sender][delegate] = true;
        emit DelegateAdded(msg.sender, delegate);
    }

    /// @notice Removes a delegate from the institution
    /// @param delegate The address of the delegate to remove
    function removeInstitutionDelegate(address delegate) external {
        require(institutions[msg.sender], "Caller is not an institution");
        require(institutionDelegates[msg.sender][delegate], "Delegate not registered");

        institutionDelegates[msg.sender][delegate] = false;
        emit DelegateRemoved(msg.sender, delegate);
    }

    /// @notice Issues a new credential
    /// @param student The address of the student receiving the credential
    /// @param certificateHash The hash of the certificate content
    /// @param ipfsHash The IPFS hash where the full certificate is stored
    /// @param encryptedMetadata Additional encrypted metadata about the credential
    /// @param credentialType The type of the credential
    /// @param expiryDate The expiry date of the credential
    /// @param programHash The hash of the program details
    function issueCredential(
        address student,
        bytes32 certificateHash,
        string calldata ipfsHash,
        bytes32 encryptedMetadata,
        string calldata credentialType,
        uint256 expiryDate,
        bytes32 programHash
    ) external whenNotPaused onlyInstitution {
        require(student != address(0), "Invalid student address");
        require(certificateHash != bytes32(0), "Invalid certificate hash");
        require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
        require(encryptedMetadata != bytes32(0), "Invalid metadata");
        require(bytes(credentialType).length > 0, "Invalid credential type");
        require(!usedHashes[certificateHash], "Certificate hash already used");

        _credentialIds.increment();
        uint256 newCredentialId = _credentialIds.current();

        Credential memory newCredential = Credential({
            id: newCredentialId,
            institution: msg.sender,
            student: student,
            certificateHash: certificateHash,
            ipfsHash: ipfsHash,
            encryptedMetadata: encryptedMetadata,
            timestamp: block.timestamp,
            isRevoked: false,
            credentialType: credentialType,
            expiryDate: expiryDate,
            programHash: programHash
        });

        credentials[newCredentialId] = newCredential;
        studentCredentials[student].push(newCredentialId);
        institutionCredentials[msg.sender].push(newCredentialId);
        usedHashes[certificateHash] = true;

        bytes32 accessHash = _generateAccessHash(student, newCredentialId);
        studentCredentialAccess[accessHash] = true;

        emit CredentialIssued(
            newCredentialId,
            msg.sender,
            student,
            certificateHash,
            ipfsHash,
            credentialType,
            expiryDate
        );
    }

    /// @notice Revokes an existing credential
    /// @param credentialId The ID of the credential to revoke
    /// @param reason The reason for revoking the credential
    function revokeCredential(uint256 credentialId, string calldata reason) 
        external 
        whenNotPaused 
        credentialExists(credentialId) 
    {
        Credential storage credential = credentials[credentialId];
        require(
            credential.institution == msg.sender || 
            institutionDelegates[credential.institution][msg.sender],
            "Not authorized to revoke"
        );
        require(!credential.isRevoked, "Already revoked");

        credential.isRevoked = true;
        emit CredentialRevoked(credentialId, msg.sender, reason);
    }

    // Helper functions
    function getInstitutionForDelegate(address delegate) public view returns (address) {
        for (address institution = address(1); institution != address(0); institution = address(uint160(institution) + 1)) {
            if (institutionDelegates[institution][delegate]) {
                return institution;
            }
        }
        return address(0);
    }

    function _generateAccessHash(address student, uint256 credentialId) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(student, credentialId));
    }

    // Enhanced getter functions
    function getCredentialMetadata(uint256 credentialId) 
        external 
        view 
        credentialExists(credentialId) 
        returns (bytes32) 
    {
        Credential memory credential = credentials[credentialId];
        bytes32 accessHash = _generateAccessHash(msg.sender, credentialId);
        
        require(studentCredentialAccess[accessHash], "Not authorized to access");
        require(!credential.isRevoked, "Credential revoked");
        
        return credential.encryptedMetadata;
    }

    function isCredentialValid(uint256 credentialId) 
        external 
        view 
        credentialExists(credentialId) 
        returns (bool) 
    {
        Credential memory credential = credentials[credentialId];
        return !credential.isRevoked && 
               (credential.expiryDate == 0 || credential.expiryDate > block.timestamp);
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}