import React, {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
// import * as tfjs from './import/tfjs'
// import * as tf from './import/tfjs'
// import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs';
// import * as cocoSsd from './import/coco-ssd'
import * as cocoSsd from "@tensorflow-models/coco-ssd";

// import PersonCounter from './components/PersonCounter'

function App() {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const [personCount, setPersonCount] = useState<number>(0);

  // getting userMedia to video element
  const getVideo = async () => {
    await navigator.mediaDevices.getUserMedia({
      // video: {width: 1920, height:1080}
      video: {width: 760, height:520}
      // video: true
    })
    .then(stream => {
      let video = videoRef.current;
        video.srcObject = stream;
        video.play()
    })
    .catch(err => {
      console.error(err);
    })
  }

  useEffect(()=>{
    getVideo();
  }, [videoRef])
  
  let canvas:HTMLCanvasElement;
  let ctx:any;
  useEffect(()=>{
    canvas = canvasRef.current as HTMLCanvasElement;
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#00FFFF"
  },[canvasRef])
  
  function drawBox(results:any) {
		let person = 0;
		for(let i = 0; i <= results?.length; ++i) {
			console.log(results?.length)
			if(results[i]?.class == "person") {
				person++;
				// ctx.fillStyle = "red";
				// ctx.fillRect(results[i]?.bbox[0], results[i]?.bbox[1], 5, 5);
				// ctx.fillRect(results[i]?.bbox[0], results[i]?.bbox[3], 5, 5);
				// ctx.fillRect(results[i]?.bbox[2], results[i]?.bbox[1], 5, 5);
				// ctx.fillRect(results[i]?.bbox[2], results[i]?.bbox[3], 5, 5);
				ctx?.beginPath();
				ctx?.rect(results[i]?.bbox[0], results[i]?.bbox[1],results[i]?.bbox[2], results[i]?.bbox[3]);
				ctx?.stroke();
			}
      setPersonCount(person)
		}
		// document.getElementById("person-counting").innerHTML = `<h1>Person Detected: ${person}</h1>`
	}

  let modelPromise:any;
  let model;
  let results;
  window.onload = () => modelPromise = cocoSsd.load();

  async function objectDetection() {
    
		//load model
		model = await modelPromise;
		//object detection
		results = await model?.detect(canvas);
		//draw
		drawBox(results);
		//console.log(results);
	}

  //get video frame
	async function getVideoFrame(){
		ctx?.save();
		ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
		ctx?.drawImage(videoRef.current, 0, 0);
		
		await objectDetection();

		ctx?.restore();
	}

	setInterval(getVideoFrame, 1);

  const videoStyle = {
    display:'None'
  }

  return (
    <div className="App">
      <header className="App-header">
        <video ref={videoRef} style={videoStyle} autoPlay />
        <canvas ref={canvasRef} width="760px" height="520px"></canvas>
        <div><h1>Person Detected: {personCount}</h1></div>
      </header>
    </div>
  );
}

export default App;
