/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { toast } from 'react-toastify';
import BackdropComponent from '../../components/BackdropComponent';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

export interface DialogHandlesStandardTableEdit {
  standarTableEdit: (id: string) => void;
}

interface PropsPage {
  MachineStandardTable: string;
}

const EditStandarTable: React.ForwardRefRenderFunction<DialogHandlesStandardTableEdit, PropsPage> = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const [OpenStandardTableEdit, setOpenStandardTableEdit] = useState(false);
  const [Img, setImg] = useState('');
  const [Id, setId] = useState('');
  const { user } = useAuth();
  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const standarTableEdit = async (id: string) => {
    setOpenStandardTableEdit(true);
    setId(id);
    setImg(props.MachineStandardTable);
  };

  useImperativeHandle(ref, () => {
    return {
      standarTableEdit,
    };
  });

  const handleCloseEdit = () => {
    setOpenStandardTableEdit(false);
  };

  async function handleSubmitStandardTableImg(file: File) {
    if (file) {
      try {
        setLoading(true);

        if (Id) {
          const dataFile = new FormData();
          dataFile.append('id', Id);
          dataFile.append('user', user.name);
          dataFile.append('user_id', user.id);
          dataFile.append('timezone', MyTimezone);
          dataFile.append('file', file);

          const responseUpdateImg = await api.post('machine-settings-image/standard_table', dataFile);
          responseUpdateImg.data && setImg(responseUpdateImg.data.standard_table_file_url);
          toast.success('Updated Standard Table!');
        } else {
          throw new Error('Id Form not found');
        }
      } catch (error) {
        toast.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSubmitStandardTableImgRemove() {
    try {
      setLoading(true);

      if (Id) {
        await api.put('machine-settings-image/', {
          id: Id,
          user: user.name,
          user_id: user.id,
          timezone: MyTimezone,
        });
        setImg('');
        toast.success('Removed Standard Table!');
      } else {
        throw new Error('Id Form not found');
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog onClose={handleCloseEdit} fullWidth maxWidth="md" open={OpenStandardTableEdit}>
      <DialogTitle>Standard Table</DialogTitle>
      <DialogContent>
        <BackdropComponent state={loading} message="Saving machine standar table" />
        <Card>
          {/* <CardActionArea>{Img && <CardMedia style={{ height: '400px' }} image={Img} title="stanndard table img" />}</CardActionArea> */}
          {Img && <img src={Img} alt="standard table" />}
          <CardActions>
            <>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                type="file"
                id="contained-button-file-standard-table"
                onChange={e => e.target.files && handleSubmitStandardTableImg(e.target.files[0])}
              />
              <Button size="small" disabled={!Img} color="secondary" onClick={() => handleSubmitStandardTableImgRemove()}>
                Remove
              </Button>
              <label htmlFor="contained-button-file-standard-table">
                <Button size="small" color="secondary" component="span">
                  alter
                </Button>
              </label>
              <Button size="small" color="primary" onClick={handleCloseEdit}>
                Close
              </Button>
            </>
          </CardActions>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default forwardRef(EditStandarTable);
