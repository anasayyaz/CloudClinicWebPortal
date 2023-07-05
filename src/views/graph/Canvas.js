import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from 'constants/baseUrl';

const Canvas = (props) => {
    const canvasRef = useRef(null);
    let hCanvas, wCanvas;
    const { user } = useSelector((state) => state?.user);
    const [errorText, setErrorText] = useState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();
    const [status, setStatus] = useState(1);
    const getECGValueApi = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/vitalsign/getPatientVitalSignbyVisit/586`, {
                method: 'GET',
                body: null,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }).then((response) => {
                response.json().then((data) => {
                    if (data == 'Sorry, no luck, No Data Found in our system!') {
                        setErrorText('No ECG Data Found in our system!');
                    } else {
                        if (data.ecg == null) {
                            setStatus(0);
                        } else {
                            setStatus(1);
                            setData(data.ecg && data.ecg.split(','));
                        }
                    }
                });
            });
        } catch (err) {}
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        hCanvas = 300;
        console.log(window.innerHeight + ', ' + window.innerWidth);
        if (window.innerWidth >= 2133 && window.innerHeight >= 1076) {
            wCanvas = 420;
            hCanvas = 350;
        } else if (window.innerWidth >= 1920 && window.innerHeight >= 969) {
            wCanvas = 400;
        } else if (window.innerWidth >= 1745 && window.innerHeight >= 881) {
            wCanvas = 350;
        } else if (window.innerWidth >= 1536 && window.innerHeight >= 775) {
            wCanvas = 300;
        } else if (window.innerWidth > 1000 && window.innerWidth <= 1500) {
            wCanvas = 380;
        } else if (window.innerWidth <= 1000) {
            wCanvas = 500;
        }
        getECGValueApi();
    }, []);

    useEffect(() => {
        if (status == 1) {
            const canvas = canvasRef.current;
            var ctx = canvas.getContext('2d'),
                w = canvas.width,
                h = canvas.height,
                px = 0,
                opx = 0,
                speed = 1,
                py = h * 0.8,
                opy = py;

            ctx.strokeStyle = '#202020';
            ctx.lineWidth = 1;

            var i = 0;
            function PYval() {
                py = -data[i] / 10 + 200;
                i = i + 4;
                if (i == data.length - 1) i = 0;
            }
            loop();

            function loop() {
                ctx.strokeStyle = '#00bd00';
                ctx.lineWidth = 4;
                PYval();
                px = px + 2;
                ctx.beginPath();
                ctx.moveTo(opx, opy);
                ctx.lineTo(px, py);
                ctx.stroke();

                opx = px;
                opy = py;
                if (opx >= window.innerWidth) {
                    px = opx = 0;

                    ctx.strokeStyle = '#202020';
                    ctx.lineWidth = 1;

                    ctx.clearRect(0, 0, w, h);
                }

                requestAnimationFrame(loop);
            }
        }
    }, [data]);

    return (
        <React.Fragment>
            {status ? (
                <canvas
                    ref={canvasRef}
                    width="800"
                    height="400"
                    style={{
                        backgroundColor: 'black'
                    }}
                />
            ) : (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        widht: '100%'
                    }}
                >
                    <h2 style={{ backgroundColor: '#000000', color: '#00bd00', padding: '10px' }}>No ECG data found</h2>
                </div>
            )}
        </React.Fragment>
    );
};

export default Canvas;
