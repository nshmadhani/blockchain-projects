 App = {
     web3Provider: null,
     contracts: {},
     content: null,
     hasVoted: false,
     init: async function () {
         App.content = $("#cotent");
         return await App.initWeb3();
     },

     initWeb3: async function () {
         if (typeof web3 != 'undefined') {
             App.web3Provider = web3.currentProvider;

         } else {
             App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
         }
         App.web3 = new Web3(App.web3Provider);
         return App.initContract();
     },


     render: function () {

         var electionInstance;


        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
              App.account = account;
              $("#address").html("Your Account: " + account);
            }
        });

        

         App.contracts.Election.deployed().then(instance =>  electionInstance = instance)
            .then( () => 
                electionInstance.hasVoted({
                    from:App.account
                })
            )
            .then((result) => App.hasVoted =  result.logs[0].args.voted)
             .then(() => {
                 electionInstance.candidatesCount()
                     .then((candidatesCount) => {
                        for (var i = 1; i <= candidatesCount.toNumber(); i++) {
                             electionInstance.candidates(i).then((candidate) => {
                                console.log(candidate);
                                var btnStr = !App.hasVoted ? `<td><button class="btn btn-primary" onclick="App.castVote(${candidate[0].toNumber()})">Vote</button>
                                </td>`:"";
                                 $('#table-candidates').append(`<tr><td>${candidate[0].toNumber()}</td>
                                                                <td>${candidate[1]}</td>
                                                                <td>${candidate[2].toNumber()}</td>
                                                                ${btnStr}
                                                                </tr>`)
                             });
                        }
                     });

             })

     },

     initContract: function () {
         $.getJSON("Election.json", function (election) {
             App.contracts.Election = TruffleContract(election);
             App.contracts.Election.setProvider(App.web3Provider);

             return App.render();
         });
     },

     

     addCandidate: function() {
        var electionInstance;
        App.contracts.Election.deployed()
            .then(instance => electionInstance = instance)
            .then(() => {
                
                var candidateName = $('#usr').val();
                console.log("Adding ",candidateName)
                electionInstance.addCandidate(candidateName);


            })
     },

     castVote: function (candidateID) {
        
        var electionInstance;
        App.contracts.Election.deployed()
            .then(instance => electionInstance = instance)
            .then(() => {

                electionInstance.castVote(candidateID,{from : App.account});

            })



     }

 };

 $(function () {
     $(window).load(function () {
         App.init();
     });
 });