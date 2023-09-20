import { useState } from 'react';
import Papa from 'papaparse';
// import CSVReadfunc from '../Functions/CSVReadfunc';

function CSVReader({ onDataUpdate }) {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true, // Treat the first row as the header
      complete: (result) => {
        // Convert the parsed data into an array of objects
        const dataObjects = result.data.map((row) => ({
          id: row.id,
          longitude: parseFloat(row.longitude),
          latitude: parseFloat(row.latitude),
          temperature: parseFloat(row.temp),
          humidity: parseFloat(row.humidity),
          co: parseFloat(row.co),
          co2: parseFloat(row.co2),
          voc: parseFloat(row.voc),
          lpg: parseFloat(row.lpg),
          pm25: parseFloat(row.pm25),
          pm10: parseFloat(row.pm10),
          time: row.time,

        }));
        console.log(result.data);
        // Update the state with the structured data
        setCsvData(dataObjects);
        
        // Pass the structured data to the parent component
        onDataUpdate(dataObjects);
      },
    });
  };
  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {/* <table>
        <thead>
          <tr>
            {csvData[0] && csvData[0].map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
}

export default CSVReader