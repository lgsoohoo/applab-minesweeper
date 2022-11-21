//  Minesweeper!


//making 2d array       http://www.javascriptkit.com/javatutors/twoarray1.shtml
//happy/sad/win/O faces http://i.crackedcdn.com/phpimages/article/4/5/4/110454.jpg?v=1
//bomb image from       http://iconshow.me/media/images/ui/Streamline-Icon/png/256/21-bomb-bug.png


var timeSec=0;
var timeMin=0;
var holdingFlag=false;
var squaresClicked=0; //to help know if you beat the game
var board;
var block = false;
var boardSize =9;
var cheatCode="";
setup(boardSize);

//for(var i =0; i<=6; i++) //show the grid for devs
  //showElement("grid"+i); //WARNING: up and down is considered x values, left/riught = y values


timedLoop(1000,function(){
  var dispMin;
  var dispSec;//to have 04:04 as time instead of 4:4
  //window   commented out 'window'
  if(!block)
    timeSec++;
  
  if(timeSec==60)
  {
    timeSec=0;
    timeMin++;
  }
  
  if(timeSec<10)
    dispSec="0"+timeSec;
  else
    dispSec=timeSec;
    
  if(timeMin<10)
    dispMin="0"+timeMin;
  else
    dispMin=timeMin;
  

  //wont be able to see one's place of the seconds when person hits 1000 min. 
  //1000min=16+ hours so VERY unlikly
  //also will break when time is negative
  
  setText("timer",dispMin+":"+dispSec);
  //console.log(Math.round(time/60)+":"+(time%60));

});


function setup(size)
{
  board = new Array(size);          //generates the 2d array/board
  for(var k = 0;k<board.length;k++)
    board[k]=new Array(size);
  
  for(var i =0;i<board.length;i++)  //sets all spaces to 'false'(no bombs)
    for(var j = 0; j<board[i].length;j++)
      board[i][j]=false;
  
  for(var c = 0; c<board.length*4/3;c++)  //sets random spaces to 'true'(has a bomb). #of bombs in game = 4/3*board length
  {
    var rand1=randomNumber(0,board.length-1);
    var rand2=randomNumber(0,board.length-1);
    if(board [rand1][rand2]===true)
      c--;
    board [rand1][rand2]=true;
    
    //console.log("bomb At:"+rand1+rand2);//print where each bomb is
  } 
}//end setup(size)

function checkSpot(x,y)//button lables will need to be "x.y"
{ 
  var bombsAround = 0;
  if(holdingFlag)//marking things a flags
  {
    setProperty("flagBttn","background-color","#b3b3b3");
      if(getProperty(x+"."+y,"image")=="assets/red-flag.png")//if you want to remove flags
        {
          setProperty(x+"."+y,"image","");
          if(getText(x+"."+y)==="")
            setProperty(x+"."+y,"background-color","#b3b3b3");
          else
            setProperty(x+"."+y,"background-color","#717171");
        }
      else
        {
          setProperty(x+"."+y,"image","assets/red-flag.png");
          setProperty(x+"."+y,"background-color","red");
        }
    holdingFlag=false;
    return;
  }//end if(holdingFlag)  
  
  if(getProperty(x+"."+y,"image")=="assets/red-flag.png")//if its got a flag on it, dont let them click on it
    return;

  if(board[x][y]||block)//kill them if there is a bomb
    {
      winGame(false);
      return;
    }
    
  for(var a=x-1;a<x+2;a++) //determine howmany bombs around
      for(var b=y-1;b<y+2;b++)
        if((a>-1&&a<board.length)&&(b>-1&&b<board[a].length))//will makesure that a&b dont go out of bounds
          if(board[a][b])//==true
          {
            bombsAround++;
            //console.log("BOMB found at "+a+","+b);
          }

  updateSquare(bombsAround,x,y);
  
  if(bombsAround===0)//click 8 squares around it- U know it is safe (does the expanding 0's part)
    { //console.log("running teh clikc around");
      for(var a2=x-1;a2<x+2;a2++)
        for(var b2=y-1;b2<y+2;b2++)
          if((a2>-1&&a2<board.length)&&(b2>-1&&b2<board[a2].length))//will makesure that a&b dont go out of bounds
            if(getText(a2+"."+b2)==="")//prevents it from clicking on the same (alreadyu ckecked) buttons over and over in a loop
              checkSpot(a2,b2);
    }
  
  
  
}//end checkSpot(x,y)

function winGame(win)
{ //show all bombs
    for(var i =0;i<board.length;i++)  
      for(var j = 0; j<board[i].length;j++)
        if(board[i][j])
          setProperty(i+"."+j,"image","assets/bomb.png");

  block=true;//dont let you click on new squares
  if(win)
    {
     showElement("winFace");
    }
  else
    {
     showElement("deadFace");
    }
  

}//end endGame()

function updateSquare(numBombs,x,y)
{
  squaresClicked++;
  //console.log("num of squares clicked ="+squaresClicked);
      
  setProperty(x+"."+y,"background-color","#505050");//make it look like its pushed down

  var color="red";
  if(numBombs===0)//make no num appear 
    color="#505050";
  else if(numBombs===1)
    color="#0010ff";
  else if(numBombs===2)
    color="#009c1d";
  else if(numBombs===3)
    color="red";
  else if(numBombs===4)
    color="#ff6b00";
  else if(numBombs===5)
    color="#fffd00";
  
  setProperty(x+"."+y,"text-color",color);
  setText(x+"."+y,numBombs);
  
  if(squaresClicked+boardSize*4/3==boardSize*boardSize)
    winGame(true);

}

function updateFace(isHappy)
{
  if(holdingFlag)//dont show oFace if holding flag
    return;
  if(isHappy)
  {
    showElement("oFace");
    hideElement("happyFace");
  }
  else
    {
    showElement("happyFace");
    hideElement("oFace");
    }
  
}

function reset(){
  
  squaresClicked=0; 
  block = false;
  timeSec=-1;//to account for when the game actually starts
  timeMin=0;
  cheatCode="";
  setup(boardSize);
  
  hideElement("deadFace");
  hideElement("winFace");
  
  for(var i =0;i<board.length;i++)  
    for(var j = 0; j<board[i].length;j++)
      {
        setText(i+"."+j,"");
        setProperty(i+"."+j,"background-color","#b3b3b3");
        setProperty(i+"."+j,"image","");
      }

}//end reset()



////////////////////////////////////////////button/onEvent code



onEvent("happyFace", "click", function() {reset();});
onEvent("deadFace", "click", function() {reset();});
onEvent("winFace", "click", function() {reset();});


onEvent("field", "mousemove", function(){
  updateFace(false);
});

onEvent("field", "keydown", function(event) {//the 'xyzzy' cheat code
  if(event.key=="Backspace")
    cheatCode="";
  else
    cheatCode+=event.key;
  
  if(cheatCode=="xyzzyShiftEnterEnter"||cheatCode=="xyzzyEnterShiftEnter")
    winGame(true);
  
  //console.log("cheatCode:"+cheatCode);
});

onEvent("flagBttn", "click", function() {
  if(block)  //block from marking flags when dead
    return;

  if(holdingFlag)
  { //makes you unclick the flag
    setProperty("flagBttn","background-color","#b3b3b3");
    holdingFlag=false;
  }
  else
  {
    setProperty("flagBttn","background-color","red");
    holdingFlag=true;
  }
  //console.log("flagBttn clicked!");
});



//each of these lines link a button to its x&y coord. 


  //mouseDown-onEvents
onEvent("0.0", "mousedown", function() {updateFace(true);});
onEvent("0.1", "mousedown", function() {updateFace(true);});
onEvent("0.2", "mousedown", function() {updateFace(true);});
onEvent("0.3", "mousedown", function() {updateFace(true);});
onEvent("0.4", "mousedown", function() {updateFace(true);});
onEvent("0.5", "mousedown", function() {updateFace(true);});
onEvent("0.6", "mousedown", function() {updateFace(true);});
onEvent("0.7", "mousedown", function() {updateFace(true);});
onEvent("0.8", "mousedown", function() {updateFace(true);});


onEvent("1.0", "mousedown", function() {updateFace(true);});
onEvent("1.1", "mousedown", function() {updateFace(true);});
onEvent("1.2", "mousedown", function() {updateFace(true);});
onEvent("1.3", "mousedown", function() {updateFace(true);});
onEvent("1.4", "mousedown", function() {updateFace(true);});
onEvent("1.5", "mousedown", function() {updateFace(true);});
onEvent("1.6", "mousedown", function() {updateFace(true);});
onEvent("1.7", "mousedown", function() {updateFace(true);});
onEvent("1.8", "mousedown", function() {updateFace(true);});


onEvent("2.0", "mousedown", function() {updateFace(true);});
onEvent("2.1", "mousedown", function() {updateFace(true);});
onEvent("2.2", "mousedown", function() {updateFace(true);});
onEvent("2.3", "mousedown", function() {updateFace(true);});
onEvent("2.4", "mousedown", function() {updateFace(true);});
onEvent("2.5", "mousedown", function() {updateFace(true);});
onEvent("2.6", "mousedown", function() {updateFace(true);});
onEvent("2.7", "mousedown", function() {updateFace(true);});
onEvent("2.8", "mousedown", function() {updateFace(true);});


onEvent("3.0", "mousedown", function() {updateFace(true);});
onEvent("3.1", "mousedown", function() {updateFace(true);});
onEvent("3.2", "mousedown", function() {updateFace(true);});
onEvent("3.3", "mousedown", function() {updateFace(true);});
onEvent("3.4", "mousedown", function() {updateFace(true);});
onEvent("3.5", "mousedown", function() {updateFace(true);});
onEvent("3.6", "mousedown", function() {updateFace(true);});
onEvent("3.7", "mousedown", function() {updateFace(true);});
onEvent("3.8", "mousedown", function() {updateFace(true);});


onEvent("4.0", "mousedown", function() {updateFace(true);});
onEvent("4.1", "mousedown", function() {updateFace(true);});
onEvent("4.2", "mousedown", function() {updateFace(true);});
onEvent("4.3", "mousedown", function() {updateFace(true);});
onEvent("4.4", "mousedown", function() {updateFace(true);});
onEvent("4.5", "mousedown", function() {updateFace(true);});
onEvent("4.6", "mousedown", function() {updateFace(true);});
onEvent("4.7", "mousedown", function() {updateFace(true);});
onEvent("4.8", "mousedown", function() {updateFace(true);});


onEvent("5.0", "mousedown", function() {updateFace(true);});
onEvent("5.1", "mousedown", function() {updateFace(true);});
onEvent("5.2", "mousedown", function() {updateFace(true);});
onEvent("5.3", "mousedown", function() {updateFace(true);});
onEvent("5.4", "mousedown", function() {updateFace(true);});
onEvent("5.5", "mousedown", function() {updateFace(true);});
onEvent("5.6", "mousedown", function() {updateFace(true);});
onEvent("5.7", "mousedown", function() {updateFace(true);});
onEvent("5.8", "mousedown", function() {updateFace(true);});


onEvent("6.0", "mousedown", function() {updateFace(true);});
onEvent("6.1", "mousedown", function() {updateFace(true);});
onEvent("6.2", "mousedown", function() {updateFace(true);});
onEvent("6.3", "mousedown", function() {updateFace(true);});
onEvent("6.4", "mousedown", function() {updateFace(true);});
onEvent("6.5", "mousedown", function() {updateFace(true);});
onEvent("6.6", "mousedown", function() {updateFace(true);});
onEvent("6.7", "mousedown", function() {updateFace(true);});
onEvent("6.8", "mousedown", function() {updateFace(true);});


onEvent("7.0", "mousedown", function() {updateFace(true);});
onEvent("7.1", "mousedown", function() {updateFace(true);});
onEvent("7.2", "mousedown", function() {updateFace(true);});
onEvent("7.3", "mousedown", function() {updateFace(true);});
onEvent("7.4", "mousedown", function() {updateFace(true);});
onEvent("7.5", "mousedown", function() {updateFace(true);});
onEvent("7.6", "mousedown", function() {updateFace(true);});
onEvent("7.7", "mousedown", function() {updateFace(true);});
onEvent("7.8", "mousedown", function() {updateFace(true);});


onEvent("8.0", "mousedown", function() {updateFace(true);});
onEvent("8.1", "mousedown", function() {updateFace(true);});
onEvent("8.2", "mousedown", function() {updateFace(true);});
onEvent("8.3", "mousedown", function() {updateFace(true);});
onEvent("8.4", "mousedown", function() {updateFace(true);});
onEvent("8.5", "mousedown", function() {updateFace(true);});
onEvent("8.6", "mousedown", function() {updateFace(true);});
onEvent("8.7", "mousedown", function() {updateFace(true);});
onEvent("8.8", "mousedown", function() {updateFace(true);}); 
 
 
 //mouseup-onEvents

onEvent("0.0", "mouseup", function() {updateFace(false); checkSpot(0,0);});
onEvent("0.1", "mouseup", function() {updateFace(false); checkSpot(0,1);});
onEvent("0.2", "mouseup", function() {updateFace(false); checkSpot(0,2);});
onEvent("0.3", "mouseup", function() {updateFace(false); checkSpot(0,3);});
onEvent("0.4", "mouseup", function() {updateFace(false); checkSpot(0,4);});
onEvent("0.5", "mouseup", function() {updateFace(false); checkSpot(0,5);});
onEvent("0.6", "mouseup", function() {updateFace(false); checkSpot(0,6);});
onEvent("0.7", "mouseup", function() {updateFace(false); checkSpot(0,7);});
onEvent("0.8", "mouseup", function() {updateFace(false); checkSpot(0,8);});


onEvent("1.0", "mouseup", function() {updateFace(false); checkSpot(1,0);});
onEvent("1.1", "mouseup", function() {updateFace(false); checkSpot(1,1);});
onEvent("1.2", "mouseup", function() {updateFace(false); checkSpot(1,2);});
onEvent("1.3", "mouseup", function() {updateFace(false); checkSpot(1,3);});
onEvent("1.4", "mouseup", function() {updateFace(false); checkSpot(1,4);});
onEvent("1.5", "mouseup", function() {updateFace(false); checkSpot(1,5);});
onEvent("1.6", "mouseup", function() {updateFace(false); checkSpot(1,6);});
onEvent("1.7", "mouseup", function() {updateFace(false); checkSpot(1,7);});
onEvent("1.8", "mouseup", function() {updateFace(false); checkSpot(1,8);});


onEvent("2.0", "mouseup", function() {updateFace(false); checkSpot(2,0);});
onEvent("2.1", "mouseup", function() {updateFace(false); checkSpot(2,1);});
onEvent("2.2", "mouseup", function() {updateFace(false); checkSpot(2,2);});
onEvent("2.3", "mouseup", function() {updateFace(false); checkSpot(2,3);});
onEvent("2.4", "mouseup", function() {updateFace(false); checkSpot(2,4);});
onEvent("2.5", "mouseup", function() {updateFace(false); checkSpot(2,5);});
onEvent("2.6", "mouseup", function() {updateFace(false); checkSpot(2,6);});
onEvent("2.7", "mouseup", function() {updateFace(false); checkSpot(2,7);});
onEvent("2.8", "mouseup", function() {updateFace(false); checkSpot(2,8);});


onEvent("3.0", "mouseup", function() {updateFace(false); checkSpot(3,0);});
onEvent("3.1", "mouseup", function() {updateFace(false); checkSpot(3,1);});
onEvent("3.2", "mouseup", function() {updateFace(false); checkSpot(3,2);});
onEvent("3.3", "mouseup", function() {updateFace(false); checkSpot(3,3);});
onEvent("3.4", "mouseup", function() {updateFace(false); checkSpot(3,4);});
onEvent("3.5", "mouseup", function() {updateFace(false); checkSpot(3,5);});
onEvent("3.6", "mouseup", function() {updateFace(false); checkSpot(3,6);});
onEvent("3.7", "mouseup", function() {updateFace(false); checkSpot(3,7);});
onEvent("3.8", "mouseup", function() {updateFace(false); checkSpot(3,8);});


onEvent("4.0", "mouseup", function() {updateFace(false); checkSpot(4,0);});
onEvent("4.1", "mouseup", function() {updateFace(false); checkSpot(4,1);});
onEvent("4.2", "mouseup", function() {updateFace(false); checkSpot(4,2);});
onEvent("4.3", "mouseup", function() {updateFace(false); checkSpot(4,3);});
onEvent("4.4", "mouseup", function() {updateFace(false); checkSpot(4,4);});
onEvent("4.5", "mouseup", function() {updateFace(false); checkSpot(4,5);});
onEvent("4.6", "mouseup", function() {updateFace(false); checkSpot(4,6);});
onEvent("4.7", "mouseup", function() {updateFace(false); checkSpot(4,7);});
onEvent("4.8", "mouseup", function() {updateFace(false); checkSpot(4,8);});


onEvent("5.0", "mouseup", function() {updateFace(false); checkSpot(5,0);});
onEvent("5.1", "mouseup", function() {updateFace(false); checkSpot(5,1);});
onEvent("5.2", "mouseup", function() {updateFace(false); checkSpot(5,2);});
onEvent("5.3", "mouseup", function() {updateFace(false); checkSpot(5,3);});
onEvent("5.4", "mouseup", function() {updateFace(false); checkSpot(5,4);});
onEvent("5.5", "mouseup", function() {updateFace(false); checkSpot(5,5);});
onEvent("5.6", "mouseup", function() {updateFace(false); checkSpot(5,6);});
onEvent("5.7", "mouseup", function() {updateFace(false); checkSpot(5,7);});
onEvent("5.8", "mouseup", function() {updateFace(false); checkSpot(5,8);});


onEvent("6.0", "mouseup", function() {updateFace(false); checkSpot(6,0);});
onEvent("6.1", "mouseup", function() {updateFace(false); checkSpot(6,1);});
onEvent("6.2", "mouseup", function() {updateFace(false); checkSpot(6,2);});
onEvent("6.3", "mouseup", function() {updateFace(false); checkSpot(6,3);});
onEvent("6.4", "mouseup", function() {updateFace(false); checkSpot(6,4);});
onEvent("6.5", "mouseup", function() {updateFace(false); checkSpot(6,5);});
onEvent("6.6", "mouseup", function() {updateFace(false); checkSpot(6,6);});
onEvent("6.7", "mouseup", function() {updateFace(false); checkSpot(6,7);});
onEvent("6.8", "mouseup", function() {updateFace(false); checkSpot(6,8);});


onEvent("7.0", "mouseup", function() {updateFace(false); checkSpot(7,0);});
onEvent("7.1", "mouseup", function() {updateFace(false); checkSpot(7,1);});
onEvent("7.2", "mouseup", function() {updateFace(false); checkSpot(7,2);});
onEvent("7.3", "mouseup", function() {updateFace(false); checkSpot(7,3);});
onEvent("7.4", "mouseup", function() {updateFace(false); checkSpot(7,4);});
onEvent("7.5", "mouseup", function() {updateFace(false); checkSpot(7,5);});
onEvent("7.6", "mouseup", function() {updateFace(false); checkSpot(7,6);});
onEvent("7.7", "mouseup", function() {updateFace(false); checkSpot(7,7);});
onEvent("7.8", "mouseup", function() {updateFace(false); checkSpot(7,8);});


onEvent("8.0", "mouseup", function() {updateFace(false); checkSpot(8,0);});
onEvent("8.1", "mouseup", function() {updateFace(false); checkSpot(8,1);});
onEvent("8.2", "mouseup", function() {updateFace(false); checkSpot(8,2);});
onEvent("8.3", "mouseup", function() {updateFace(false); checkSpot(8,3);});
onEvent("8.4", "mouseup", function() {updateFace(false); checkSpot(8,4);});
onEvent("8.5", "mouseup", function() {updateFace(false); checkSpot(8,5);});
onEvent("8.6", "mouseup", function() {updateFace(false); checkSpot(8,6);});
onEvent("8.7", "mouseup", function() {updateFace(false); checkSpot(8,7);});
onEvent("8.8", "mouseup", function() {updateFace(false); checkSpot(8,8);});


/* onEvent code generator:

  for(var i = 0;i<9;i++)
    {for (var j = 0;j<9;j++)
      console.log("onEvent(\""+i+"."+j+"\", \"mouseup\", function() {updateFace(false); checkSpot("+i+","+j+");});");
      console.log("\n"); 
    }
    
*/

