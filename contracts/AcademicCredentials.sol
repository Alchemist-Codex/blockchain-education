// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./access/Ownable.sol";
import "./security/Pausable.sol";
import "./utils/Counters.sol";

contract AcademicCredentials is Ownable, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _credentialIds;

    // Structs
    struct Credential {
        uint256 id;
        address institution;
        address student;
        bytes32 certificateHash;
        string ipfsHash;
        string metadata;
        uint256 timestamp;
        bool isRevoked;
    }

    // Mappings
    mapping(uint256 => Credential) private credentials;
    mapping(address => bool) private institutions;
    mapping(address => uint256[]) private studentCredentials;
    mapping(address => uint256[]) private institutionCredentials;

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
    modifier onlyInstitution() {
        require(institutions[msg.sender], "Caller is not a registered institution");
        _;
    }

    modifier credentialExists(uint256 credentialId) {
        require(credentials[credentialId].timestamp != 0, "Credential does not exist");
        _;
    }

    // Constructor
    constructor() {
        _credentialIds.increment(); // Start IDs from 1
    }

    // Institution Management
    function registerInstitution(address institution) external onlyOwner {
        require(!institutions[institution], "Institution already registered");
        institutions[institution] = true;
        emit InstitutionRegistered(institution);
    }

    function removeInstitution(address institution) external onlyOwner {
        require(institutions[institution], "Institution not registered");
        institutions[institution] = false;
        emit InstitutionRemoved(institution);
    }

    function isInstitution(address account) external view returns (bool) {
        return institutions[account];
    }

    // Credential Management
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
    function getCredential(uint256 credentialId) 
        external 
        view 
        credentialExists(credentialId) 
        returns (Credential memory) 
    {
        return credentials[credentialId];
    }

    function getStudentCredentials(address student) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return studentCredentials[student];
    }

    function getInstitutionCredentials(address institution) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return institutionCredentials[institution];
    }

    // Emergency Functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Batch Operations
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
