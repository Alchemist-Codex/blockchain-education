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
        bytes32 encryptedMetadata;  // Changed from string to bytes32 for encrypted metadata
        uint256 timestamp;        // Time when the credential was issued
        bool isRevoked;          // Flag to indicate if the credential has been revoked
    }

    // Mappings
    mapping(uint256 => Credential) private credentials;           // Maps credential ID to Credential struct
    mapping(address => bool) private institutions;               // Maps institution address to their registration status
    mapping(address => uint256[]) private studentCredentials;    // Maps student address to their credential IDs
    mapping(address => uint256[]) private institutionCredentials; // Maps institution address to their issued credential IDs
    mapping(bytes32 => bool) private studentCredentialAccess;    // Maps hash of (student, credentialId) to access permission

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

    // Functions
    /// @notice Registers an institution to issue credentials
    /// @param institution The address of the institution to register
    function registerInstitution(address institution) external onlyOwner {
        require(!institutions[institution], "Institution already registered");
        institutions[institution] = true;
        emit InstitutionRegistered(institution);
    }

    /// @notice Removes an institution from the list of registered institutions
    /// @param institution The address of the institution to remove
    function removeInstitution(address institution) external onlyOwner {
        require(institutions[institution], "Institution not registered");
        institutions[institution] = false;
        emit InstitutionRemoved(institution);
    }

    /// @notice Issues a new credential
    /// @param student The address of the student receiving the credential
    /// @param certificateHash The hash of the certificate content
    /// @param ipfsHash The IPFS hash where the full certificate is stored
    /// @param encryptedMetadata Additional encrypted metadata about the credential
    function issueCredential(
        address student,
        bytes32 certificateHash,
        string memory ipfsHash,
        bytes32 encryptedMetadata
    ) external whenNotPaused {
        require(institutions[msg.sender], "Only registered institutions can issue credentials");

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
            isRevoked: false
        });

        credentials[newCredentialId] = newCredential;
        studentCredentials[student].push(newCredentialId);
        institutionCredentials[msg.sender].push(newCredentialId);

        // Grant access to student
        bytes32 accessHash = _generateAccessHash(student, newCredentialId);
        studentCredentialAccess[accessHash] = true;

        emit CredentialIssued(newCredentialId, msg.sender, student, certificateHash, ipfsHash);
    }

    /// @notice Revokes an existing credential
    /// @param credentialId The ID of the credential to revoke
    function revokeCredential(uint256 credentialId) external whenNotPaused {
        Credential storage credential = credentials[credentialId];
        require(credential.institution == msg.sender, "Only the issuing institution can revoke this credential");
        require(!credential.isRevoked, "Credential already revoked");

        credential.isRevoked = true;
        emit CredentialRevoked(credentialId, msg.sender);
    }

    // Add helper function to generate access control hash
    function _generateAccessHash(address student, uint256 credentialId) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(student, credentialId));
    }

    // Add function to access metadata (only by student)
    function getCredentialMetadata(uint256 credentialId) external view returns (bytes32) {
        Credential memory credential = credentials[credentialId];
        bytes32 accessHash = _generateAccessHash(msg.sender, credentialId);
        
        require(studentCredentialAccess[accessHash], "Only the credential owner can access metadata");
        require(!credential.isRevoked, "Credential has been revoked");
        
        return credential.encryptedMetadata;
    }
}