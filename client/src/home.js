import React from 'react';
import Jobs from './jobs';
import Button from '@material-ui/core/Button';


export default function Home({ Home }) {
    return (

        <div>
            Hello Home

            <Button onClick={Jobs} color="primary">
                Close
                     </Button>

        </div>
    )
}