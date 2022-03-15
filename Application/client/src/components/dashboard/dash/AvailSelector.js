import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Modal, Box } from '@mui/material';
import TimeSelector from './TimeSelector'
import styles from '../styles/AvailSelector.module.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function AvailSelector({selectedDate}) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
        <div>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* <TimeSelector label="Start Time"/>
                <TimeSelector label="End Time"/> */}
                <form className={styles.timeContainer} noValidate>
                    <TextField
                        id="time"
                        label="Start Time"
                        type="time"
                        defaultValue="07:30"
                        className={styles.timeField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 300, // 5 min
                        }}
                    />

                    <TextField
                        id="time"
                        label="End Time"
                        type="time"
                        defaultValue="07:30"
                        className={styles.timeField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                        step: 300, // 5 min
                        }}
                    />
                </form>
                <h1>
                    date: {selectedDate.getDate()}
                </h1>
            </Box>

            
        </Modal>

        {
            selectedDate.getDate() > 0 &&
            <Button onClick={handleOpen} variant="text">+ ADD AVAILABILITY</Button>}
        </div>

    );
}

// TimeSelector.propTypes = {
//   classes: PropTypes.object.isRequired,
// };