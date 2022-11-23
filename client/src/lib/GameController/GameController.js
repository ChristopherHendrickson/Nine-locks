import all_cards_images from "../cards/imageExport"

class GameController {
    static faceToValMap = {
        'a':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'j':11,'q':12,'k':13
    }
    constructor( { init_deck, players, setPlayers, setDeck, setPiles, setIsTurn, user, setPilesOnly, setUsingKey, setWinner }) {
        
        this.setPlayers = setPlayers
        this.setDeck = setDeck
        this.setPiles = setPiles
        this.setIsTurn = setIsTurn
        this.user = user
        this.deck = new Deck(init_deck)
        this.setPilesOnly = setPilesOnly
        this.setUsingKey = setUsingKey
        this.setWinner = setWinner

        this.piles = []
        for (let i=0;i<9;i++) {
            this.piles.push(new Pile(this.deck.draw()))
        }
        this.piles[4].position = 'unlocked'
        
        
        this.players = []
        for (let p of players) {
            const newPlayer = new Player(p)
            
            for (let i = 0; i < 3; i++) {
                this.pickup(newPlayer.handShown) //add cards to players hands
                this.pickup(newPlayer.handHidden)
            }
            this.players.push(newPlayer)
        }
    }

    playerLeft(player) {

        //updating game controller players
        const dcdPlayer = this.players.filter((p)=>{
            return p.id == player.id
        })
        if (dcdPlayer) {
            dcdPlayer[0].connected = false
        } else {
            console.log('-------ERROR: recieved player disconnect but player was not found in current game-------')
        }
        this.playersToState()

        
    }

    pickup(hand) {
        hand.cards.push(this.deck.draw())
    }

    playersToState () {
        const statePlayers = this.players.map((p)=>{
            return {
                'id':p.id,
                'username':p.username,
                'connected':p.connected,
                'handShown':p.handShown.cards.map((card) => {return {'id':card.id,'image':card.image}}),
                'handHidden':p.handHidden.cards.map((card) => {return {'id':card.id,'image':card.image}})
            }
        })
        this.setPlayers(statePlayers)
    }

    deckToState () {
        this.setDeck(this.deck.count)
    }

    pilesToState () {
        const statePiles = this.piles.map((pile)=>{
            return {
                'card':{
                    'id':pile.card.id,
                    'image':pile.card.image
                },
                'count':pile.count,
                'playableIds': [...pile.playableIds],   
                'position':pile.position
            }
        })
        this.setPiles(statePiles)
    }

    move(move) {

        const updateTurn = (_move) => {
            if (_move.endTurn) {
                if (move.player.id==this.user.id) {
                    this.setIsTurn(false)
                } else {
                    const currentPlayerIndex = this.players.findIndex((player)=>{
                        return player.id==_move.player.id
                    })
                    let nextPlayerIndex = (currentPlayerIndex+1) % this.players.length
                    while (!this.players[nextPlayerIndex].connected || !this.players[nextPlayerIndex].active) {
                        nextPlayerIndex = (nextPlayerIndex+1) % this.players.length
                    }
                    
                    
                    this.setIsTurn(this.players[nextPlayerIndex].id==this.user.id)
                }
            } else {
                this.setIsTurn(_move.player.id==this.user.id) //retain turn for current player
            }
            // this.setIsTurn(true)
        }
        const player = this.players.find((player)=>{
            return player.id === move.player?.id
        })
        switch(move.type) {
            
            case 'init':
                this.playersToState()
                this.deckToState()
                this.pilesToState()
                break
            case 'pickup':
                const hand = player.handHidden.cards.length > player.handShown.cards.length ? player.handShown : player.handHidden
                this.pickup(hand)
                this.playersToState()
                this.deckToState()


                // if all piles are unlocked then there is no move after pickup
                const unlockedPiles = this.piles.filter((pile)=>{
                    console.log(pile.status)
                    return pile.position == 'unlocked'
                })
                console.log(unlockedPiles,' unlocked ')
                if (unlockedPiles.length==9) {
                    move.endTurn=true
                } else {
                    this.setPilesOnly(true)
                }
                updateTurn(move)

                break
            case 'changePile':
                const pile = this.piles[move.pileIndex]
                if (pile.position=='facedown') {
                    pile.position='unlocked'
                    if (pile.card.value==9) {
                        move.endTurn=false
                        this.setUsingKey(true)
                    } else {
                        this.setUsingKey(false)
                    }
                } else if (pile.position=='locked') {
                    pile.position='unlocked'
                } else {
                    pile.position='locked'
                }
                console.log('cahnge pile route, setting pilesOnly')
                this.setPilesOnly(pile.card.value==9)
                updateTurn(move)
                this.pilesToState()
                break
            case 'playCard':
                const _pile = this.piles[move.pileIndex]
                const cardId = move.cardId
                const cardInShown = player.handShown.cards.find((card)=>{
                    return card.id == cardId
                })
                const cardInHidden = player.handHidden.cards.find((card)=>{
                    return card.id == cardId
                })
                const card = cardInHidden || cardInShown
                
                _pile.recieveCard(card)
                player.handShown.cards = player.handShown.cards.filter((card)=>{
                    return card.id!=cardId
                })
                player.handHidden.cards = player.handHidden.cards.filter((card)=>{
                    return card.id!=cardId
                })

                if (card.value==9) {
 
                    move.endTurn=false
                    this.setUsingKey(true)
                    this.setPilesOnly(true)
                }

                this.pilesToState()
                this.playersToState()

                if (player.handShown.cards.length == 0) {
                    this.setWinner([player])
                    this.setIsTurn(false)
                } else {
                    updateTurn(move)
                }
                break
            case 'noMove': 
                player.active='false'
                player.finalScore = {
                    'handShownCount':player.handShown.cards.length,
                    'handHiddenCount':player.handHidden.cards.length
                }
                //check players
                const totalFinished = this.players.filter((p)=>{
                    return p.active
                }).length

                if (totalFinished === this.players.length) {
                    
                    const score1 = this.players.reduce((min,p)=>{
                        return Math.min(min,p.finalScore.handShownCount)
                    },Infinity)

                    const potentialWinners = this.players.filter((p)=>{
                        return this.players.finalScore.handShownCount === score1
                    })

                    if (potentialWinners.length===1) {
                        this.setWinner(potentialWinners)
                    } else {
                        
                        const score2 = potentialWinners.reduce((min,p)=>{
                            return Math.min(min,p.finalScore.handHiddenCount)
                        },Infinity)
                        
                        const potentialWinners2 = potentialWinners.filter((p)=>{
                            return this.players.finalScore.handHiddenCount === score2
                        })

                        this.setWinner(potentialWinners2)
                        
                    }
                    
                }

                updateTurn(move)
                break
            default:
                return
        }
        // turn handler


    }

}

class Card {
    constructor(id) {
        // id will be in form of '{suit}{face}'
        this.id = id
        this.value = GameController.faceToValMap[id.slice(1)]
        this.suit = id[0] // suit
        this.face = id.slice(1) // number or royal
        this.image = all_cards_images[id] // image ref
        this.colour = this.suit == 'h' || this.suit == 'd' ? 'red' : 'black'

    }
}

class Deck {
    constructor(init_deck) {
        this.cards = init_deck.map((id)=>{
            return new Card(id)
        })
        this.count = this.cards.length
    }

    draw() {
        this.count-=1
        return this.cards.pop()
    }
}

class Pile {
    constructor(card) {
        this.card = card
        this.position = 'facedown'
        this.count = 1
        this.playableIds = this.getPlayable(this.card) 
        this.lockCount = 5
    }

    getPlayable (card) {
        const playableList = [] 

        const [ sameSuits, diffSuits ] = card.colour == 'red' ? [['h','d'],['s','c']] : [['s','c'],['h','d']]
        const val = card.value
        const valAddOne = val + 1 == 14 ? 1 : val + 1
        const valLessOne = val - 1 == 0 ? 13 : val - 1 
        const addOneId = Object.keys(GameController.faceToValMap).find(key => GameController.faceToValMap[key] === valAddOne);
        const lessOneId = Object.keys(GameController.faceToValMap).find(key => GameController.faceToValMap[key] === valLessOne);
        const valId = Object.keys(GameController.faceToValMap).find(key => GameController.faceToValMap[key] === val);

        for (let ss of sameSuits) {
            playableList.push(ss+addOneId)
            playableList.push(ss+lessOneId)
        }

        for (let ds of diffSuits) {
            playableList.push(ds+valId)
        }
        return playableList
        // every car has 6 cards that can be played on it
        // getPlayable returns a list of card id's that can be played on itself
    }

    recieveCard (card) {
        this.card = card
        this.count +=1
        this.playableIds = this.getPlayable(this.card)
        if (this.count == this.lockCount) {
            this.position = 'locked'
        } 
    }
}

class Player {
    constructor(player) {
        this.id = player.id
        this.username = player.username
        this.connected = player.connected
        this.handShown = new Hand(true)
        this.handHidden = new Hand(false)
        this.finalScore = {
            'shownHandCount':null,
            'hiddenHandCount':null
        }
        this.active = true
    }

}

class Hand {
    constructor(visible) {
        this.visible = visible
        this.cards = []
    }
}





export default GameController