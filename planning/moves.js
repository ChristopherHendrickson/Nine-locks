// These are the potential move payloads a client could send through the 'move' socket api
// And how the data will be structured so the gamecontroller can implement the move into each clients state
// all moves have a 'type' prop to tell the controller what kind of move it is dealing with
// each move will contain the player object of who made the move and the room id
// One client can send multiple moves per turn. Ths way other clients get live feed of what the user is doing
// each move will contain an 'endTurn' Boolean, which will be true when they finish their turn
// playCard moves have a 'victor' boolean, which will be true when they win the game 
// if endTurn, the controller can iterate the current players turn
// if victor, the game ends and displays the winner

// 9's are a special case for end turn, as they can unexpectedly cause someones turn to contiune
// eg if a player flips a game pile and it is a 9 they can use the key effect, therefore the gameController
// will overrule the endturn boolean in that case

// There are several other cases where the endTurn is overwritted:
//      if all piles are already unlocked on pickup, the player cannot unlock a pile and the turn ends

// player object refers to the user object containing id and username props

const init = { //initalises the game using the init data sent by the host
    'type': "init",
    'room_id':'room_id',
    'init_deck':[], //list of strings of card id's
    'players': [], //list of player objects
     
}

const pickup = {
    'type':'pickup',
    'room_id':'room_id',
    'player':'player  object',
    'endTurn':false
}

const changePile = { // locks / unlocks / flips the selected pile, depending on current pile status
    'type':'changePile',
    'room_id':'room_id',
    'pileIndex':2,
    'player':'player object',
    'endTurn':false
}

const playCard = {
    'type':'playCard',
    'room_id':'room_id',
    'CardId':'s4',
    'player':'player object',
    'endTurn':false
}

const noMove = { //sent when the player has no allowed moves and the deck is empty so they can not pick up
    'type': 'noMove',
    'room_id':'room_id',
    'player': 'player object',
    'endTurn':true
}
// when the gamecontroller recieves noMove the player object prop of 'active' is set to false
// and their turns will be skipped for the remainder of the game, same as if the player is disconnected (note connected prop is handled through the 'user_left' prop)
// the finalScores prop wil be added to the player object
// if all players become inactive, the result of the game is calcualated using finalScores
