const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademicCredentials", function () {
  let AcademicCredentials;
  let academicCredentials;
  let owner;
  let institution;
  let student;
  let otherAccount;

  beforeEach(async function () {
    // Get signers
    [owner, institution, student, otherAccount] = await ethers.getSigners();

    // Deploy contract
    AcademicCredentials = await ethers.getContractFactory("AcademicCredentials");
    academicCredentials = await AcademicCredentials.deploy();
    await academicCredentials.deployed();
  });

  describe("Institution Management", function () {
    it("Should register an institution", async function () {
      await academicCredentials.registerInstitution(institution.address);
      expect(await academicCredentials.isInstitution(institution.address)).to.be.true;
    });

    it("Should remove an institution", async function () {
      await academicCredentials.registerInstitution(institution.address);
      await academicCredentials.removeInstitution(institution.address);
      expect(await academicCredentials.isInstitution(institution.address)).to.be.false;
    });

    it("Should only allow owner to register institutions", async function () {
      await expect(
        academicCredentials.connect(otherAccount).registerInstitution(institution.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Credential Management", function () {
    const certificateHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test certificate"));
    const ipfsHash = "QmTest123";
    const metadata = '{"name": "Test Certificate", "course": "Blockchain"}';

    beforeEach(async function () {
      await academicCredentials.registerInstitution(institution.address);
    });

    it("Should issue a credential", async function () {
      const tx = await academicCredentials.connect(institution).issueCredential(
        student.address,
        certificateHash,
        ipfsHash,
        metadata
      );
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'CredentialIssued');
      expect(event).to.not.be.undefined;

      const credentialId = event.args.credentialId;
      const credential = await academicCredentials.getCredential(credentialId);
      expect(credential.student).to.equal(student.address);
      expect(credential.institution).to.equal(institution.address);
      expect(credential.certificateHash).to.equal(certificateHash);
      expect(credential.ipfsHash).to.equal(ipfsHash);
      expect(credential.metadata).to.equal(metadata);
      expect(credential.isRevoked).to.be.false;
    });

    it("Should revoke a credential", async function () {
      const tx = await academicCredentials.connect(institution).issueCredential(
        student.address,
        certificateHash,
        ipfsHash,
        metadata
      );
      const receipt = await tx.wait();
      const credentialId = receipt.events[0].args.credentialId;

      await academicCredentials.connect(institution).revokeCredential(credentialId);
      const credential = await academicCredentials.getCredential(credentialId);
      expect(credential.isRevoked).to.be.true;
    });

    it("Should get student credentials", async function () {
      await academicCredentials.connect(institution).issueCredential(
        student.address,
        certificateHash,
        ipfsHash,
        metadata
      );

      const studentCredentials = await academicCredentials.getStudentCredentials(student.address);
      expect(studentCredentials.length).to.equal(1);
    });

    it("Should batch issue credentials", async function () {
      const students = [student.address, otherAccount.address];
      const hashes = [certificateHash, certificateHash];
      const ipfsHashes = [ipfsHash, ipfsHash];
      const metadataArray = [metadata, metadata];

      await academicCredentials.connect(institution).batchIssueCredentials(
        students,
        hashes,
        ipfsHashes,
        metadataArray
      );

      const studentCredentials = await academicCredentials.getStudentCredentials(student.address);
      expect(studentCredentials.length).to.equal(1);
    });
  });

  describe("Emergency Functions", function () {
    it("Should pause and unpause the contract", async function () {
      await academicCredentials.pause();
      await academicCredentials.registerInstitution(institution.address);
      
      await expect(
        academicCredentials.connect(institution).issueCredential(
          student.address,
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test")),
          "ipfs",
          "{}"
        )
      ).to.be.revertedWith("Pausable: paused");

      await academicCredentials.unpause();
      // Should work after unpausing
      await academicCredentials.connect(institution).issueCredential(
        student.address,
        ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test")),
        "ipfs",
        "{}"
      );
    });
  });
}); 