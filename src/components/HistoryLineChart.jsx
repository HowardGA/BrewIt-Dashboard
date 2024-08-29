import React,{useState,useEffect} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import InfoIcon from "@mui/icons-material/InfoRounded";
import Modal from "@mui/material/Modal"; 
import Typography from "@mui/material/Typography"; 
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import axios from 'axios';

const HistoryLineChart = ({ data, index, startDateTime,userId, onDeleteChart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalChartOptions, setModalChartOptions] = useState(null);
  const [matchingDataState,setMatchingDataState] = useState('');
  const [mode, setMode] = useState('');
  const [beer, setBeer] = useState('');
  const [ingredients, setIngredients] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://brewiy-back.vercel.app/api/users/${userId}`);
        const userData = await response.json();

        const matchingData = userData.data.find((dataObj) => dataObj.StartDateTime === startDateTime);
        const arrayHistoryOUT = matchingData.ArrayHistory;
        //we are storing only whats inside the arrayhistory here
        setMatchingDataState(arrayHistoryOUT);
        

        if (matchingData) {
          setMode(matchingData.mode);
          setBeer(matchingData.beer);
          setIngredients(matchingData.ingredients);
          const modalOptions = {
            chart: {
              type: 'spline',
              backgroundColor: '#B73E3E',
            },
            title: {
              text: `Start Date: ${startDateTime}`,
              style: {
                color: '#FFF',
              },
            },
            subtitle: {
              text: "Brew It Temperature",
              style: {
                color: '#DDD',
              },
            },
            xAxis: {
              type: 'datetime',
              title: {
                text: 'Time',
                style: {
                  color: '#DDD',
                },
              },
              labels: {
                style: {
                  color: '#DDD',
                },
                formatter: function () {
                  const date = new Date(this.value);
                  const time = date.toLocaleTimeString();
                  return time;
                },
              },
            },
            yAxis: {
              title: {
                text: 'Temperature (\u00B0 C)',
                style: {
                  color: '#DDD',
                },
              },
              labels: {
                format: '{text}\u00B0',
                style: {
                  color: '#DDD',
                },
              },
            },
            tooltip: {
              formatter: function () {
                const temperature = this.y.toFixed(2);
                const time = new Date(this.x).toLocaleTimeString();
                return `Time: ${time}<br>Temperature: ${temperature}\u00B0C`;
              },
            },
            plotOptions: {
              spline: {
                dataLabels: {
                  enabled: false,
                },
                marker: {
                  enabled: false,
                },
              },
            },
            series: [
              {
                name: 'Temperature',
                data: matchingData.ArrayHistory.map((item) => ({
                  x: new Date(item.DATE_TIME).getTime(),
                  y: item.T,
                })),
                color: '#F1C93B',
                lineWidth: 3,
              },
            ],
            scrollbar: {
              enabled: true,
            },
          };

          setModalChartOptions(modalOptions);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [userId, startDateTime]);

  

  const processedData = data.map((item) => ({
    x: new Date(item.DATE_TIME).getTime(),
    y: item.T,
  }));

  const chartOptions = {
    chart: {
      type: 'spline',
      backgroundColor: '#B73E3E',
    },
    title: {
      text: `Start Date: ${startDateTime}`,
      style: {
        color: '#FFF',
      },
    },
    subtitle: {
      text: "Brew It Temperature",
      style: {
        color: '#DDD',
      },
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time',
        style: {
          color: '#DDD',
        },
      },
      labels: {
        style: {
          color: '#DDD',
        },
        formatter: function () {
          const date = new Date(this.value);
          const time = date.toLocaleTimeString();
          return time;
        },
      },
    },
    yAxis: {
      title: {
        text: 'Temperature (\u00B0 C)',
        style: {
          color: '#DDD',
        },
      },
      labels: {
        format: '{text}\u00B0',
        style: {
          color: '#DDD',
        },
      },
    },
    tooltip: {
      formatter: function () {
        const temperature = this.y.toFixed(2);
        const time = new Date(this.x).toLocaleTimeString();
        return `Time: ${time}<br>Temperature: ${temperature}\u00B0C`;
      },
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: false,
        },
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: 'Temperature',
        data: processedData,
        color: '#F1C93B',
        lineWidth: 3,
      },
    ],
    scrollbar: {
      enabled: true,
    },
  };

  const DEL = {
    phone: `${userId}`,
    StartDateTime: `${startDateTime}`
  };

  const deleteChart = () => {
    axios.post('https://brewiy-back.vercel.app/api/publish-message', DEL)
      .then((response) => {
        console.log(response.data.message);
        onDeleteChart(); // Call the onDeleteChart function to update the state
      })
      .catch((error) => {
        console.error('Error deleting chart:', error);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const ModalContent = ({ closeModal, arrayHistory }) => {
    return (
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        color: '#000',
        width: '200%',
        overflow: 'auto',
        transform: 'translate(-25%, 0%)',
        maxWidth: '200%',
        maxHeight: '500px'
      }}>
        <Typography variant="h3">Additional Information</Typography>
        <Typography >This is the full chart with all the readings from the sensors, also adding a table with the information</Typography>
        <Typography>of each point in the graph.</Typography>
        <br/>
        <Typography variant="h4">Process Executed: {mode}</Typography>
        <Typography variant="h4">Beer: {beer}</Typography>
        <Typography variant="h4">Ingredients: {ingredients}</Typography>
        <HighchartsReact highcharts={Highcharts} options={modalChartOptions} />
  
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* These are the table rows */}
                <TableCell style={{ color: 'black' }}>DATE</TableCell>
                <TableCell style={{ color: 'black' }}>Temperature</TableCell>
                <TableCell style={{ color: 'black' }}>Water Pump</TableCell>
                <TableCell style={{ color: 'black' }}>Brewing Process</TableCell>
                <TableCell style={{ color: 'black' }}>Brewing Temperature</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {arrayHistory.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {/* here it looks for the values within the araryhistory, the keys in the JSON */}
                  <TableCell style={{ color: 'black' }}>{format(parseISO(item.DATE_TIME), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                  <TableCell style={{ color: 'black' }}>{item.T}</TableCell>
                  <TableCell style={{ color: 'black' }}>{item.WP}</TableCell>
                  <TableCell style={{ color: 'black' }}>{item.BP}</TableCell>
                  <TableCell style={{ color: 'black' }}>{item.BTemp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Button variant="contained" onClick={closeModal} style={{ marginTop: '10px' }}>
          Close
        </Button>
      </div>
    );
  };
  
  

  return (
    <div>
      <button onClick={openModal} style={{ background: '#F1C93B', color: '#fff', fontWeight: 'bold' }}>
        <InfoIcon sx={{ color: '#fff', fontSize: "18px" }} />
      </button>
      <button onClick={deleteChart} style={{ background: '#B73E3E', color: '#fff', fontWeight: 'bold'}}>X</button>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />

      <Modal open={isModalOpen} onClose={closeModal}>
        <div style={{width:'45%', transform: 'translate(60%, 25%)' }}>
          <ModalContent closeModal={closeModal}  arrayHistory={matchingDataState}/>
          {/* check all the way up wjat its inside the mathingDataState */}
        </div>
      </Modal>
    </div>
  );
};

export default HistoryLineChart;
