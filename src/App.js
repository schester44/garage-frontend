import React from "react"
import styled from "styled-components"
import axios from "axios"
import { format, addSeconds, isBefore } from "date-fns"

const Container = styled("div")`
	width: 100%;
	height: 100%;

	background: ${({ isOpen }) => (isOpen ? "red" : "green")};
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	h1 {
		font-size: 20vw;
	}

	h2 {
		font-size: 8vw;
	}
`

const App = () => {
	const [{ status, lastOpen, lastCheck, limit }, setState] = React.useState({})

	React.useEffect(() => {
		const checkStatus = () => {
			// Door has been open for max limit
			if (isBefore(lastOpen, addSeconds(new Date(), limit))) {
				var audio = new Audio("alarm.mp3")
				audio.play()
			}

			axios.get(process.env.REACT_APP_API_ENDPOINT).then(({ data }) => {
				setState(data)

				// check if the door is still open in 2 seconds
				setTimeout(() => checkStatus(), 2000)
			})
		}

		checkStatus()
	}, [])

	const isOpen = status === "open"

	if (!status) return null

	return (
		<Container isOpen={isOpen}>
			<h2>Garage Door</h2>
			<h1>{isOpen ? "Open" : "Closed"}</h1>

			<h3>Last Checked: {format(lastCheck, "MMM Do, YYYY h:mm A")}</h3>
			<h3>Last Opened: {format(lastOpen, "MMM Do, YYYY h:mm A")}</h3>
		</Container>
	)
}

export default App
