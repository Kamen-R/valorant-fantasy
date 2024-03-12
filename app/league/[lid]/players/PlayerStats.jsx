// "use client"

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const columns = [
    {field: 'name', headerName: 'Name', width: 150 },
    {field: 'team', headerName: 'Team', width: 150 },
    {field: 'region', headerName: 'Region', width: 150},
];

async function getStats() {
    const supabase = createClientComponentClient()
  
    const { data, error } = await supabase.from('Players').select()
  
    if (error) {
      console.log(error.message)
    }
    return data
}
  
export default async function PlayerStats() {
    const stats = await getStats()
  
    return (
      <div>
        <DataGrid 
          getRowId={(row) => row.pid}
          rows={stats}
          columns={columns}
        />
      </div>
    )
}
