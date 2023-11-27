//Governor deployed to 0x4e53BA482733E32a65376d99367f0e3E0E63933A 
//Token deployed to 0x413136b7b1391775f1AF94036126A7bc3e7c1aE0
const { ethers } = require("hardhat");

async function main() {

    const [owner, signer1] = await ethers.getSigners();
  
    // gets the address of the token before it is deployed=
    const MyGovernor = await ethers.getContractFactory("MyGovernor");
    const governor = MyGovernor.attach('0x4e53BA482733E32a65376d99367f0e3E0E63933A');
  
    const MyToken = await ethers.getContractFactory("MyToken");
    const token = MyToken.attach('0x413136b7b1391775f1AF94036126A7bc3e7c1aE0')

//  delegate the votes to yourself

    await token.delegate(owner.address);
    let delegatedVotes = await token.delegates(owner.address);

//    create a proposal

    const mintTokens = "6000"
    console.log(ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the owner more tokens!")));

    const tx1 = await governor.connect(owner).propose(
        [token.address],
        [0],
        [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther(mintTokens)])],
        "Give the owner more tokens!"
      );

      const receipt1 = await tx1.wait();
      const event = receipt1.events.find(x => x.event === 'ProposalCreated');
      const { proposalId } = event.args;
      console.log(`Proposal ID is ${proposalId}`);
      const blockNumber1 = await ethers.provider.getBlockNumber();
      console.log(`Current block number is ${blockNumber1}`);

// vote on the proposal
      // wait for the 2 block voting delay
      await tx1.wait(4);
      const blockNumber2 = await ethers.provider.getBlockNumber();
      console.log(`Current block number is ${blockNumber2}`);

      const tx2 = await governor.connect(owner).castVote(proposalId, 1);      
      const receipt2 = await tx2.wait();
      const voteCastEvent = receipt2.events.find(x => x.event === 'VoteCast');
      console.log(voteCastEvent);

//wait 10 blocks
      await tx2.wait(12);
      const blockNumber3 = await ethers.provider.getBlockNumber();
      console.log(`Current block number is ${blockNumber3}`);

// execute the proposal

      await governor.connect(owner).execute(
          [token.address],
          [0],
          [token.interface.encodeFunctionData("mint", [owner.address, ethers.utils.parseEther(mintTokens)])],
          ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Give the owner more tokens!"))
        );

        const balance = await token.balanceOf(owner.address);

        console.log(await balance.toString());
  
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  