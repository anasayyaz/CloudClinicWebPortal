import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CanvasJSReact from './canvasjs.react';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const QTCGraph = (props) => {
    const { user } = useSelector((state) => state?.user);
    let graphData = [];
    let h, w;
    const [options, setOptions] = useState();
    const [errorText, setErrorText] = useState();
    const [data, setData] = useState([]);
    const [visitDate, setVisitDate] = useState([]);

    const getQTCValueApi = async () => {
        try {
            const response = await fetch(`${BASE_URL}api/VitalSign/getPatienttemp/${props.patient_id}`, {
                method: 'GET',
                body: null,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            }).then((response) => {
                response.json().then((data) => {
                    if (data) {
                        setVisitDate(data?.vitalsignGraph?.datetime.split(','));
                        setData(data?.vitalsignGraph?.qtc.split(','));
                    }
                });
            });
        } catch (err) {
            console.log(err);
            setErrorText(err);
        }
    };

    useEffect(() => {
        h = 300;
        if (window.innerWidth >= 2133 && window.innerHeight >= 1076) {
            w = 420;
            h = 350;
        } else if (window.innerWidth >= 1920 && window.innerHeight >= 969) {
            w = 400;
        } else if (window.innerWidth >= 1745 && window.innerHeight >= 881) {
            w = 350;
        } else if (window.innerWidth >= 1536 && window.innerHeight >= 775) {
            w = 300;
        } else if (window.innerWidth > 1000 && window.innerWidth <= 1500) {
            w = 380;
        } else if (window.innerWidth <= 1000) {
            w = 500;
        }
        getQTCValueApi();
    }, []);

    useEffect(() => {
        console.log(data);
        console.log(visitDate);

        for (let i = 0; i < data.length; i++) {
            graphData.push({ label: `${visitDate[i]}`, y: parseFloat(data[i]) });
        }

        setOptions({
            width: w, //in pixels
            height: h, //in pixels
            legend: {
                horizontalAlign: 'center', // left, center ,right
                verticalAlign: 'top' // top, center, bottom
            },
            dataPointMaxWidth: 20,
            axisX: {
                // title: "Visit Date",
                labelAngle: 0,
                labelWrap: true,
                labelAutoFit: true
            },
            axisY: {
                title: 'milliseconds'
            },
            data: [
                {
                    type: 'column',
                    color: '#36a9f7',
                    dataPoints: graphData
                }
            ]
        });
    }, [data, visitDate]);

    return <div className="w-100">{options && <CanvasJSChart options={options} />}</div>;
};

export default QTCGraph;
