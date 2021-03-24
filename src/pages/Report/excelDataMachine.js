import React, { useEffect, useState} from 'react';
import CsvDownloader from 'react-csv-downloader';

function ExcelDataMachine(props) {
  const columns = [{
    id: 'first',
    displayName: 'First column'
  }, {
    id: 'second',
    displayName: 'Second column'
  }];

  const datas = [{
    first: 'foo',
    second: 'bar'
  }, {
    first: 'foobar',
    second: 'foobar'
  }];

  return (
    <div>
      <CsvDownloader
        filename="myfile"
        separator=";"
        wrapColumnChar="'"
        columns={columns}
        datas={datas}
        text="DOWNLOAD" />
    </div>
  );
}

export default ExcelDataMachine;
