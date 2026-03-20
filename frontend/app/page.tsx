"use client";

import React, { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";

export default function Home() {
	const [議題, set議題] = useState("");
	const 議題を決定 = (event) => {
		if (confirm(`議題を ${議題} に変更しますか？`)) {
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<Typography variant="h4" gutterBottom>
				万P4n神th3殿on
			</Typography>

			<Box display="flex" gap={1} alignItems="center">
				<TextField
					label="議題"
					variant="outlined"
					value={議題}
					onChange={(e) => set議題(e.target.value)}
					fullWidth
				/>
				<Button variant="contained" onClick={議題を決定}>
					決定
				</Button>
			</Box>
			<Stack spacing={2}>
				{/* 投稿カード1 */}
				<Card>
					<CardContent>
						<Box display="flex" alignItems="center" mb={1}>
							<Avatar sx={{ mr: 2 }}>A</Avatar>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Alice
							</Typography>
						</Box>
						<Typography variant="body1">
							これは静的な投稿カードの例です。
						</Typography>
					</CardContent>
				</Card>

				{/* 投稿カード2 */}
				<Card>
					<CardContent>
						<Box display="flex" alignItems="center" mb={1}>
							<Avatar sx={{ mr: 2 }}>B</Avatar>
							<Typography
								variant="subtitle2"
								color="text.secondary"
							>
								Bob
							</Typography>
						</Box>
						<Typography variant="body1">
							もう一つの投稿カードです。内容は固定です。
						</Typography>
					</CardContent>
				</Card>
			</Stack>
			<Button
				variant="contained"
				color="error" // 赤色
				startIcon={<StopIcon />} // 左側にアイコン
			>
				停止
			</Button>
		</div>
	);
}
