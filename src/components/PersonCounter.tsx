import React, {useState, useEffect} from 'react';
import './PersonCounter.css';

interface IPersonCounterProps {
    person: number
}

export default function PersonCounter(props: IPersonCounterProps){
    const [personCount, setPersonCount] = useState<Number>(0)

    return (
        <div>
            <h1>{personCount}</h1>
		    <video id="video"></video>
		    <canvas id="canvas" width="760px" height="520px"></canvas>
        </div>
    )
}