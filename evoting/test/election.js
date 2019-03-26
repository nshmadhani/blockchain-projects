var Election  = artifacts.require('./Election.sol')

contract('Election', (accounts) => {
    var electionInstance;

    it("Adding New Candidates", () => {
    
        Election.deployed()
            .then(instance => instance.addCandidate("Nishay Madhani"))
            .then(result => assert.equal(result.logs[0].args._name,"Nishay Madhani"))
        }
    )


    it("allows a voter to cast a vote", function() {
        return Election.deployed().then(function(instance) {
          electionInstance = instance;
          candidateId = 1;
          return electionInstance.castVote(candidateId, { from: accounts[0] });
        }).then(function(receipt) {;
          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "VoteCasted", "the event type is correct");
          assert.equal(receipt.logs[0].args.id.toNumber(), candidateId, "the candidate id is correct");
          return electionInstance.votesCasted(accounts[0]);
        }).then(function(voted) {
          assert(voted, "the voter was marked as voted");
          return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
          var voteCount = candidate[2];
          assert.equal(voteCount, 1, "increments the candidate's vote count");
        })
    });
    
});