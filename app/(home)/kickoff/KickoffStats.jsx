import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

// const stats = [
//     {id: 1, col1: 'Demon1', col2: 'NRG Esports', col3: "Americas", col4: 40.3, col5: 10}, 
//     {id: 3, col1: 't3xture', col2: 'Gen.G', col3: "Pacific", col4: 48.9, col5: 9},
//     {id: 4, col1: 'Ardiis', col2: 'NAVI', col3: "EMEA", col4: 34.3, col5: 8},
// ];

const columns = [
    {field: 'name', headerName: 'Name', width: 150 },
    {field: 'fpts', headerName: 'FPTS', width: 150 },
    {field: 'team', headerName: 'Team', width: 150 },
    {field: 'region', headerName: 'Region', width: 150},
];

/* const style = {
  height: 300,
  width: "50%",
  //color: 'green',
  //bgcolor: 'red',
}; */

/* export default function KickoffStats() {
  const stats = getStats()
    
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/averages")
      .then((data) => data.json())
      .then((data) => setTableData(data))
  }, [])

  console.log(tableData)

  return (
    <div>
      <DataGrid
        rows={tableData}
        columns={columns}
      />
    </div>
  )
} */

export default async function KickoffStats() {
  const supabase = createServerComponentClient()

  const { data, error } = await supabase.from('Kickoff Statistics').select()

  if (error) {
    console.log(error.message)
  }
  return data
}

// export default async function KickoffStats() {
//   const stats = await getStats()

//   return (
//     <div>
//       <DataGrid 
//         rows={stats}
//         columns={columns}
//       />
//     </div>
//   )
// }