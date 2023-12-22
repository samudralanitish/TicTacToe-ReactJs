import  { useEffect, useState } from 'react'
import './tictac.css'
import Board from './Board'
import GameOver from './GameOver'
import GameState from './GameState'
import Reset from './Reset'
import gameOverSoundAsset from '../sounds/game_over.wav'
import clickSoundAsset from '../sounds/click.wav'

//Sounds
const gameOverSound=new Audio(gameOverSoundAsset)
gameOverSound.volume=0.3;


const clickSound=new Audio(clickSoundAsset)
clickSound.volume=0.5

//Players
const PLAYER_X="X"
const PLAYER_O="O"


const winningCombinations=[
    //Rows
    {combo :[0,1,2],strikeClass:'strike-row1'},
    {combo :[3,4,5],strikeClass:'strike-row2'},
    {combo :[6,7,8],strikeClass:'strike-row3'},

    //Columns
    {combo :[0,3,6],strikeClass:'strike-column1'},
    {combo :[1,4,7],strikeClass:'strike-column2'},
    {combo :[2,5,8],strikeClass:'strike-column3'},

    //diagonals
    {combo :[0,4,8],strikeClass:'strike-diagonal1'},
    {combo :[2,4,6],strikeClass:'strike-diagonal2'}
]


//Functions
function checkWinner(tiles,setStrikeClass,setGameState){
    // console.log("checkWinner");
    for(const {combo,strikeClass} of winningCombinations){
        const tileValue1=tiles[combo[0]]
        const tileValue2=tiles[combo[1]]
        const tileValue3=tiles[combo[2]]
        
        if(tileValue1!=null && tileValue1===tileValue2 && tileValue1===tileValue3){
            setStrikeClass(strikeClass)
            if(tileValue1===PLAYER_X){
                setGameState(GameState.playerXWins)
            }
            else{
                setGameState(GameState.playerOWins)
            }
            return;
        }  
    }
    const areAllTilesFilledIn=tiles.every((tile)=>tile!==null);
    if(areAllTilesFilledIn){
        setGameState(GameState.draw)
    }
}


const TicTacToe = () => {
    const[tiles,setTiles]=useState(Array(9).fill(null))
    const[playerTurn,setPlayerTurn]=useState(PLAYER_X)
    const[strikeClass,setStrikeClass]=useState();
    const[gameState,setGameState]=useState(GameState.inProgress)
    const handleTileClick=(index)=>{
        if(gameState!==GameState.inProgress){
            return;
        }
        // console.log(index);
        if(tiles[index]!=null){
            return ;
        }
        const newTiles=[...tiles]
        newTiles[index]=playerTurn
        setTiles(newTiles)
        if(playerTurn===PLAYER_X){
            setPlayerTurn(PLAYER_O)
        }
        else{
            setPlayerTurn(PLAYER_X)
        }
    }
    const handleReset=()=>{
        // console.log('reset');
        setTiles(Array(9).fill(null));
        setStrikeClass();
        setGameState(GameState.inProgress);
        setPlayerTurn(PLAYER_X)

    }
    useEffect(()=>{
        checkWinner(tiles,setStrikeClass,setGameState);
    },[tiles]);

    useEffect(()=>{
        if(tiles.some((tile)=>tile!==null)){
            clickSound.play()
        }
    },[tiles]);

    useEffect(()=>{
        if(gameState!==GameState.inProgress){
            gameOverSound.play()
        }
    },[gameState])


    
  return (
    <div>
        <h1><span style={{color:"chartreuse"}}>Tic</span> <span style={{color:"red"}}>Tac</span> <span style={{color:"yellow"}}>Toe</span></h1>
        <Board playerTurn={playerTurn} strikeClass={strikeClass} tiles={tiles} onTileClick={handleTileClick}/>
        <GameOver gameState={gameState}/>
        <Reset gameState={gameState} onReset={handleReset}/>
    </div>
  )
}

export default TicTacToe