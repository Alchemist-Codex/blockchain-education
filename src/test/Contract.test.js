import { expect, describe, it, beforeEach } from 'vitest';
import { ethers } from 'ethers';
import config from '../config';
import contractABI from '../artifacts/contracts/AcademicCredentials.sol/AcademicCredentials.json';

describe('Development Environment Tests', () => {
  let provider;
  let contract;
  
  beforeEach(async () => {
    provider = new ethers.JsonRpcProvider(config.rpcUrl);
    contract = new ethers.Contract(
      config.contractAddress,
      contractABI.abi,
      provider
    );
  });

  it('should connect to local Ganache', async () => {
    const network = await provider.getNetwork();
    expect(Number(network.chainId)).to.equal(1337);
  });

  it('should have the correct contract address', async () => {
    expect(contract.target).to.equal(config.contractAddress);
  });
}); 