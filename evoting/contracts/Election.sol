pragma solidity ^0.5.0;


contract Election {
    
    //Constructor

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }


    event CandidateAdded(string _name);
    event VoteCasted(uint id);
    event HasCastedVote(bool voted);

    mapping (uint=>Candidate) public candidates;
    mapping (address=>uint) public votesCasted;

    uint public candidatesCount; //Counter Caching no way to know size


    


    function addCandidate(string memory _name) public {
        bytes memory nameBytes = bytes(_name);
        require(nameBytes.length != 0);
        candidatesCount++;
        candidates[candidatesCount] = Candidate({id:candidatesCount,name:_name,voteCount:0});
        emit CandidateAdded(_name);
    }

    function castVote(uint _candidateId) public  {
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        require(votesCasted[msg.sender] == 0);
        votesCasted[msg.sender] = _candidateId;
        candidates[_candidateId].voteCount ++;
        emit VoteCasted(_candidateId);
    }

    function hasVoted() public {
        emit HasCastedVote(votesCasted[msg.sender] != 0);
    }

}