import all_cards_images from "../cards/imageExport"

class GameController {
    static faceToValMap = {
        'a':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'j':11,'q':12,'k':13,
    }
    constructor( { init_deck, players, setPlayers, setDeck, setPiles, setIsTurn, user  }) {
        
        this.setPlayers = setPlayers
        this.setDeck = setDeck
        this.setPiles = setPiles
        this.setIsTurn = setIsTurn
        this.user = user
        this.deck = new Deck(init_deck)

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
        this.setPlayers(this.playersToState())

        
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
        console.log(this.piles)
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

        const updateTurn = () => {
            if (move.endTurn) {
                if (move.player.id==this.user.id) {
                    this.setIsTurn(false)
                } else {
                    const currentPlayerIndex = this.players.findIndex((player)=>{
                        return player.id==move.player.id
                    })
                    const nextPlayerIndex = (currentPlayerIndex+1) % this.players.length
                    console.log('it is turn of',this.players[nextPlayerIndex])
                    console.log('i am',this.user)
                    console.log('therefore it is my turn',this.players[nextPlayerIndex].id==this.user.id)
                    this.setIsTurn(this.players[nextPlayerIndex].id==this.user.id)
                }
            } else {
                this.setIsTurn(move.player.id==this.user.id)
            }
        }

        console.log('got move', move.type)
        switch(move.type) {
            case 'init':
                this.playersToState()
                this.deckToState()
                this.pilesToState()
                break
            case 'pickup':
                const player = this.players.find((player)=>{
                    return player.id === move.player.id
                })
                const hand = player.handHidden.cards.length > player.handShown.cards.length ? player.handShown : player.handHidden
                this.pickup(hand)
                this.playersToState()
                this.deckToState()
                updateTurn()
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

        const [ sameSuits, diffSuits ]  = card.colour = 'red' ? [['h','d'],['s','c']] : [['s','c'],['h','d']]
        const val = card.value
        const valAddOne = (val + 1) % 13 //aces can be played on kings
        const valLessOne = val - 1 == 0 ? 13 : val - 1 //kings can be played on aces
        for (let ds of diffSuits) {
            playableList.push(ds+valAddOne.toString())
            playableList.push(ds+valLessOne.toString())
        }

        for (let ss of sameSuits) {
            playableList.push(ss+val.toString())
        }
        return playableList
        // every car has 6 cards that can be played on it
        // getPlayable returns a list of card id's that can be played on itself
    }

    recieveCard (card) {
        this.card = card
        this.count +=1
        this.playable = this.getPlayable(card)
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
    }

}

class Hand {
    constructor(visible) {
        this.visible = visible
        this.cards = []
    }
}





export default GameController