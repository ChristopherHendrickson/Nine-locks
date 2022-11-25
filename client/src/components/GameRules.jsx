
const GameRules = ({ handleClose }) => {

    return (

        <div className='rules flex-col '>
            <div className="r">
            <div className='flex-col'>
            <h1>Nine Locks Rules</h1>
            
            <h3>Set Up</h3>
            <p>
                Nine Locks is a game played with 2-4 players. 
                At the start of the game each player is dealt two hands of three cards each, 
                and nine cards are placed facedown in a 3x3 grid. One of each players hands is visible to the other players, and the other is hidden.
                The game begins by flipping the centre card in the 3x3 grid.
            </p>
            <h3>Gameplay</h3>
            <p>
                At the start of each turn the player may play a card or pick up.
            </p> 
            <h4>
                Playing a Card
            </h4>
            <p>
                Cards can be played in 
                ascending or descending order on cards of the same colour (regardless of the suit), or on cards with the same value of the oppisite colour.
                For example a red 2 could have a red ace, red 3 or black 2 played on it. Kings can be played on aces and vice-versa.
                After playing a card the turn ends.
            </p>
            <h4>
                Picking up
            </h4>
            <p>
                If a player can not play a card they must pick up. They can also choose to pickup even if they have playable cards.
                When picking up the card is placed into the hand with the least number of cards (When it is equal the card goes to the hidden hand)
                After picking up, the player must then unlock a new pile by revealing a facedown card. Once all cards are face-up, after picking up a player can unlock any locked pile instead (see <em>Pile Locking</em> below).
                If all cards are already in an unlocked state when a player picks up, their turn immediately ends.
            </p>
            <h4>
                If you can't play or pickup
            </h4>
            <p>
                If at the start of a turn a player can not play any card, and can not pickup becuase the deck is empty, they are then locked out of the game and get no more turns for the remainder of the game.
                The player may still be able to win (see <em>Winning</em> below)
            </p>
            
            <h3>Winning</h3>
            <p>
                The winner of the game is the first player to get rid of all cards from their visible hand, by playing them onto the piles in the middle.
            </p>
            <h4>If All Player Are Locked Out</h4>
            <p>
                When all players become locked out the game ends, and the player with the least number of cards in their visible hand is the winner.<br></br>
                If multiple players have the same number of visible cards, of those players the one with the leaset number in their hidden hand is the winner.<br></br>
                If it is still a tie, the final result is a tie.
            </p>
            <h3>Pile Locking</h3>
            <p>
                The nine piles in the center have three states: face-down, locked, and unlocked.
                Piles change state when players pick up (See <em>Picking up</em> above), when a player activates a key (See <em>The Nine Key</em> below) or when the pile has a total of 5 cards in it.
                Once a pile has 5 cards it becomes locked and can not be played on until it is unlocked.
            </p>
            <h3>The 9 Key</h3>
            <p>
                When a Player either plays a 9, or reveals a face-down card that is a 9, they must then use the key.
                The key can be used on any of the center piles. When used on either a face-down or locked pile, the pile becomes unlocked.
                When used on an unlocked pile, the pile becomes locked.<br></br>
                9's are important! They can be used to lock a pile to prevent a player from winning, or unlock a pile you need so you can win.
            </p>
            
            </div>
            
        </div>
        <button id="btn-close-rules" onClick={handleClose}>Close</button>
        </div>
    )
}

export default GameRules