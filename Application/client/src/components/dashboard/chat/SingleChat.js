import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, Input } from '@mui/material';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import './styles/styles.css';
import io from 'socket.io-client';

//Variable value will change on deployment
const ENDPOINT = 'http://localhost:5000';
var socket, selectedChatCompare;

const SingleChat = ({ auth: { user }, selectedChat }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState('');
	const [socketConnected, setSocketConnected] = useState(false);

	const getSender = (loggedUser, users) => {
		return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
	};

	const fetchMessages = async () => {
		if (!selectedChat) {
			return;
		}

		try {
			setLoading(true);

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`
			);

			setMessages(data);
			setLoading(false);

			socket.emit('join chat', selectedChat._id);
		} catch (error) {
			console.log(error);
		}
	};

	const sendMessage = async (event) => {
		if (event.key === 'Enter' && newMessage !== '') {
			try {
				setNewMessage('');
				const { data } = await axios.post('/api/message', {
					content: newMessage,
					chatId: selectedChat._id,
				});

				socket.emit('new message', data);

				setMessages([...messages, data]);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const typingHandler = (e) => {
		setNewMessage(e.target.value);
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user);
		socket.on('connection', () => setSocketConnected(true));
	}, []);

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	useEffect(() => {
		socket.on('message received', (newMessageReceived) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageReceived.chat._id
			) {
				// give notification
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	});

	return (
		<>
			{selectedChat._id ? (
				<Box>
					<Box
						border={2}
						display='flex'
						flexDirection='column'
						padding={3}
						bgcolor='#E8E8E8'
						sx={{
							margin: '30px',
							height: '100%',
							width: '400%',
						}}
					>
						<span>
							{!selectedChat.isGroupChat
								? getSender(user, selectedChat.users)
								: selectedChat.chatName}
						</span>
						{loading ? (
							<LoadingButton
								loading
								variant='outlined'
							></LoadingButton>
						) : (
							<div className='messages'>
								<ScrollableChat messages={messages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage}>
							<Input
								placeholder='Enter your message here'
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</Box>
			) : (
				<Box
					border={2}
					display='flex'
					flexDirection='column'
					padding={3}
					bgcolor='#E8E8E8'
					sx={{
						height: '100%',
						width: '300%',
					}}
				>
					<span>Select a user to start Chatting</span>
				</Box>
			)}
		</>
	);
};

SingleChat.prototype = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(SingleChat);
