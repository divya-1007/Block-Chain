import { useState, useEffect ,useRef} from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  // prime number check
  let number = 23;
  let fage = true;
  for(let div = 2 ;div<number ;div++){
    if(number%div === 0){
        fage = false;
        break;
    }
  }

  if(fage === true){
    console.log(number ,"number is prime");
  }else{
    console.log(number ,"number is not prime");
  }
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, shouldReload] = useState(false);
  const canvasRef = useRef(null);
  
  console.log("account Details" ,account);
  const reloadEffect = () => shouldReload(!reload);
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (accounts) => setAccount(accounts[0]));
  };
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Funder", provider);
      if (provider) {
        setAccountListener(provider);
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      } else {
        console.error("Please install MetaMask!", );
      }
      if (window.ethereum) {
        provider = window.ethereum;
        try {
          await provider.enable();
        } catch {
          console.error("User is not allowed");
        }
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://localhost:7545");
      }
    };

    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, reload]);

  const transferFund = async () => {
    const { web3, contract } = web3Api;
    await contract.transfer({
      from: account,
      value: web3.utils.toWei("2", "ether"),
    });
    reloadEffect();
  };

  const withdrawFund = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmout = web3.utils.toWei("3", "ether");
    await contract.withdraw(withdrawAmout, {
      from: account,
    });
    reloadEffect();
  };

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  // console.log(web3Api.web3);

  // graphic using
  useEffect(() => {
  var canvas = document.querySelector(".hacker-3d-shiz"),
  ctx = canvas.getContext("2d"),
  canvasBars = document.querySelector(".bars-and-stuff"),
  ctxBars = canvasBars.getContext("2d"),
  outputConsole = document.querySelector(".output-console");

canvas.width = (window.innerWidth/3)*2;
canvas.height = window.innerHeight / 3;

canvasBars.width = window.innerWidth/3;
canvasBars.height = canvas.height;

outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
outputConsole.style.top = window.innerHeight / 3 + 'px'


 


/* Graphics stuff */
function Square(z) {
    this.width = canvas.width/2;
    
    if(canvas.height < 200){
      this.width = 300;
    };
  
    this.height = canvas.height;
    z = z || 0;

    this.points = [
    new Point({
        x: (canvas.width / 2) - this.width,
        y: (canvas.height / 2) - this.height,
        z: z
    }),
    new Point({
        x: (canvas.width / 2) + this.width,
        y: (canvas.height / 2) - this.height,
        z: z
    }),
    new Point({
        x: (canvas.width / 2) + this.width,
        y: (canvas.height / 2) + this.height,
        z: z
    }),
    new Point({
        x: (canvas.width / 2) - this.width,
        y: (canvas.height / 2) + this.height,
        z: z
    })];
    this.dist = 0;
}

Square.prototype.update = function () {
    for (var p = 0; p < this.points.length; p++) {
        this.points[p].rotateZ(0.001);
        this.points[p].z -= 3;
        if (this.points[p].z < -300) {
            this.points[p].z = 2700;
        }
        this.points[p].map2D();
    }
}

Square.prototype.render = function () {
    ctx.beginPath();
    ctx.moveTo(this.points[0].xPos, this.points[0].yPos);
    for (var p = 1; p < this.points.length; p++) {
        if (this.points[p].z > -(focal - 50)) {
            ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
        }
    }

    ctx.closePath();
    ctx.stroke();

    this.dist = this.points[this.points.length - 1].z;

};

function Point(pos) {
    this.x = pos.x - canvas.width / 2 || 0;
    this.y = pos.y - canvas.height / 2 || 0;
    this.z = pos.z || 0;

    this.cX = 0;
    this.cY = 0;
    this.cZ = 0;

    this.xPos = 0;
    this.yPos = 0;
    this.map2D();
}

Point.prototype.rotateZ = function (angleZ) {
    var cosZ = Math.cos(angleZ),
        sinZ = Math.sin(angleZ),
        x1 = this.x * cosZ - this.y * sinZ,
        y1 = this.y * cosZ + this.x * sinZ;

    this.x = x1;
    this.y = y1;
}

Point.prototype.map2D = function () {
    var scaleX = focal / (focal + this.z + this.cZ),
        scaleY = focal / (focal + this.z + this.cZ);

    this.xPos = vpx + (this.cX + this.x) * scaleX;
    this.yPos = vpy + (this.cY + this.y) * scaleY;
};

// Init graphics stuff
var squares = [],
    focal = canvas.width / 3,
    vpx = canvas.width / 3,
    vpy = canvas.height / 3,
    barVals = [],
    sineVal = 0;

/* fake console stuff */
var commandStart = ['Performing DNS Lookups for', 
                'Searching ', 
                'Analyzing ', 
                'Estimating Approximate Location of ', 
                'Compressing ', 
                'Requesting Authorization From : ', 
                'wget -a -t ', 
                'tar -xzf ', 
                'Entering Location ', 
                'Compilation Started of ',
                 'Downloading '],
    commandParts = ['Data Structure', 
                    'http://wwjd.com?au&2', 
                    'Texture', 
                    'TPS Reports', 
                    ' .... Searching ... ', 
                    'http://zanb.se/?23&88&far=2', 
                    'http://ab.ret45-33/?timing=1ww'],
    commandResponses = ['Authorizing ', 
                 'Authorized...', 
                 'Access Granted..', 
                 'Going Deeper....', 
                 'Compression Complete.', 
                 'Compilation of Data Structures Complete..', 
                 'Entering Security Console...', 
                 'Encryption Unsuccesful Attempting Retry...', 
                 'Waiting for response...', 
                 '....Searching...', 
                 'Calculating Space Requirements '
                ],
    isProcessing = false,
    processTime = 0,
    lastProcess = 0;


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    squares.sort(function (a, b) {
        return b.dist - a.dist;
    });
    for (var i = 0, len = squares.length; i < len; i++) {
        squares[i].update();
        squares[i].render();
    }
    
    ctxBars.clearRect(0, 0, canvasBars.width, canvasBars.height);
    
    ctxBars.beginPath();
    var y = canvasBars.height/6;
    ctxBars.moveTo(0,y);
    
    for(i = 0; i < canvasBars.width; i++){
        var ran = (Math.random()*20)-10;
        if(Math.random() > 0.98){
             ran = (Math.random()*50)-25   
        }
        ctxBars.lineTo(i, y + ran);
    }
    
    ctxBars.stroke();
    
    for(i = 0; i < canvasBars.width; i+=20){
        if(!barVals[i]){
            barVals[i] = {
                val : Math.random()*(canvasBars.height/2),
                freq : 0.1,
                sineVal : Math.random()*100
            };
        }
        
        barVals[i].sineVal+=barVals[i].freq;
        barVals[i].val+=Math.sin(barVals[i].sineVal*Math.PI/2)*5;
        ctxBars.fillRect(i+5,canvasBars.height,15,-barVals[i].val);
    }
    
    requestAnimationFrame(render);
}


function consoleOutput(){
    var textEl = document.createElement('p');
    
    if(isProcessing){
        textEl = document.createElement('span');
        textEl.textContent += Math.random() + " ";
        if(Date.now() > lastProcess + processTime){
            isProcessing = false;   
        }
    }else{
        var commandType = ~~(Math.random()*4);
        switch(commandType){
            case 0:
                textEl.textContent = commandStart[~~(Math.random()*commandStart.length)] + commandParts[~~(Math.random()*commandParts.length)];
                break;
            case 3: 
                isProcessing = true;
                processTime = ~~(Math.random()*5000);
                lastProcess = Date.now();
            default:
                 textEl.textContent = commandResponses[~~(Math.random()*commandResponses.length)];
            break;
        }
    }

    outputConsole.scrollTop = outputConsole.scrollHeight;
    outputConsole.appendChild(textEl);
    
    if (outputConsole.scrollHeight > window.innerHeight) {
       var removeNodes = outputConsole.querySelectorAll('*');
       for(var n = 0; n < ~~(removeNodes.length/3); n++){
            outputConsole.removeChild(removeNodes[n]);
        }
    }
    
    setTimeout(consoleOutput, ~~(Math.random()*200));
}


setTimeout(function(){   
      canvas.width = (window.innerWidth/3)*2;
      canvas.height = window.innerHeight / 3;

      canvasBars.width = window.innerWidth/3;
      canvasBars.height = canvas.height;

      outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
      outputConsole.style.top = window.innerHeight / 3 + 'px';
  
      focal = canvas.width / 2;
      vpx = canvas.width / 2;
      vpy = canvas.height / 2;

      for (var i = 0; i < 15; i++) {
          squares.push(new Square(-300 + (i * 200)));
      }
  
      ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';
  
      render();
      consoleOutput();
}, 200);

window.addEventListener('resize', function(){
      canvas.width = (window.innerWidth/3)*2;
      canvas.height = window.innerHeight / 3;

      canvasBars.width = window.innerWidth/3;
      canvasBars.height = canvas.height;

      outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
      outputConsole.style.top = window.innerHeight / 3 + 'px';
  
      focal = canvas.width / 2;
      vpx = canvas.width / 2;
      vpy = canvas.height / 2;
      ctx.strokeStyle = ctxBars.strokeStyle = ctxBars.fillStyle = '#00FF00';
});
}, []);


  return (
    <>
  
    <div> 

    <div className="card-wrapper">
      <div className="content">
        <div className="welcome">Welcome to</div><br/>
        <h1>PM2</h1><br />
        <div  className="card text-center  mt-5 ml-5 mr-5">
        <div  className="card-header">Funding</div>
        <div  className="card-body">
          <h5  className="card-title mt-3">Balance: {balance} ETH </h5>
          <p  className="card-text mb-5">
            Account : {account ? account : "not connected"}
          </p>
           {/* <button
            type="button"
             className="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              console.log(accounts);
            }}
          >
            Connect to metamask
          </button>  */}
          &nbsp;
          <button type="button"  className="btn btn-success mr-5 mb-3 " onClick={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button"  className="btn btn-primary ml-5 mb-3 " onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div  className="card-header">Funding</div>
      </div> 
      </div>
      <div className="shade"></div>
      <div className="card__bg__image">
        {/* <img alt="" src="http://media.futurebutterflies.net/houston-besomeone.jpg" /> */}
      </div>
      </div>
      </div>

      <canvas className='hacker-3d-shiz'  ref={canvasRef}></canvas>
      <canvas className='bars-and-stuff'  ref={canvasRef}></canvas>
      <div className="output-console"></div>
    </>
  );
}

export default App;
//npm install --save react-scripts@4.0.3
