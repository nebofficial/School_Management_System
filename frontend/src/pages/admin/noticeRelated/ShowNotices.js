import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Paper, Box, IconButton } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowNotices = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        }
    }, [currentUser._id, dispatch]);

    if (error) {
        console.error("Error loading notices:", error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address)).then(() => {
            dispatch(getAllNotices(currentUser._id, "Notice"));
        });
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (date.toString() === "Invalid Date") return "Invalid Date";
        return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
    };

    const noticeRows = noticesList?.map((notice) => ({
        title: notice.title,
        details: notice.details,
        date: formatDate(notice.date),
        id: notice._id,
    })) || [];

    const NoticeButtonHaver = ({ row }) => (
        <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
            <DeleteIcon color="error" />
        </IconButton>
    );

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />,
            name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice"),
        },
        {
            icon: <DeleteIcon color="error" />,
            name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices"),
        },
    ];

    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {response ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                            <GreenButton variant="contained" onClick={() => navigate("/Admin/addnotice")}>
                                Add Notice
                            </GreenButton>
                        </Box>
                    ) : (
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            {Array.isArray(noticesList) && noticesList.length > 0 && (
                                <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={noticeRows} />
                            )}
                            <SpeedDialTemplate actions={actions} />
                        </Paper>
                    )}
                </>
            )}
        </>
    );
};

export default ShowNotices;
