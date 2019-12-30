import React, { useState, useEffect } from 'react';
import '../css/App.css';
import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import { findIndex, without } from 'lodash';

function App() {
  const [myAppointments, setAppointments] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [formDisplay, setDisplayForm] = useState(false);
  const [sortOptions, setSortOptions] = useState({
    orderBy: 'petName',
    orderDir: 'asc'
  });
  const [queryText, setQueryText] = useState('');

  useEffect(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map((item, index) => {
          item.aptId = index;
          setLastIndex(index);
          return item;
        });

        setAppointments(apts);
      });
  }, []);

  const deleteAppointment = apt => {
    let tmpApts = myAppointments;

    tmpApts = without(tmpApts, apt);

    setAppointments(tmpApts);
  };

  const toggleForm = () => {
    const newDisplayState = !formDisplay;

    setDisplayForm(newDisplayState);
  };

  const addAppointment = newApt => {
    newApt.aptId = lastIndex + 1;

    const newApts = [newApt, ...myAppointments];

    setAppointments(newApts);

    setLastIndex(newApt.aptId);
  };

  const changeOrder = (order, dir) => {
    setSortOptions({
      orderBy: order,
      orderDir: dir
    });
  };

  const searchApts = queryString => {
    setQueryText(queryString);
  };

  const updateInfo = (name, value, id) => {
    let modApts = [...myAppointments];
    let aptIndex = findIndex(myAppointments, { aptId: id });

    modApts[aptIndex][name] = value;
    setAppointments(modApts);
  };

  let order = sortOptions.orderDir === 'asc' ? 1 : -1;
  let filteredApts = myAppointments;

  filteredApts = filteredApts
    .sort(
      (a, b) =>
        order *
        (a[sortOptions.orderBy].toLowerCase() <
        b[sortOptions.orderBy].toLowerCase()
          ? -1
          : 1)
    )
    .filter(item => {
      return (
        item['petName'].toLowerCase().includes(queryText.toLowerCase()) ||
        item['ownerName'].toLowerCase().includes(queryText.toLowerCase()) ||
        item['aptNotes'].toLowerCase().includes(queryText.toLowerCase())
      );
    });

  return (
    <main className="page bg-white" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointments
                formDisplay={formDisplay}
                toggleForm={toggleForm}
                addAppointment={addAppointment}
              />
              <SearchAppointments
                orderBy={sortOptions.orderBy}
                orderDir={sortOptions.orderDir}
                changeOrder={changeOrder}
                searchApts={searchApts}
              />
              <ListAppointments
                appointments={filteredApts}
                deleteAppointment={deleteAppointment}
                updateInfo={updateInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
