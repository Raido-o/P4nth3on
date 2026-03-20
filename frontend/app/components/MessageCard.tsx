"use client";

import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import type { Message } from "../types";
import { GREAT_PERSONS } from "../data/greatPersons";

type Props = {
  message: Message;
};

export default function MessageCard({ message }: Props) {
  const person = GREAT_PERSONS.find((p) => p.id === message.agentId);
  const avatarColor = person?.avatarColor ?? "#6366f1";
  const initial = person?.avatarInitial ?? message.agentNameJa[0];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        animation: "fadeInUp 0.3s ease",
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: avatarColor,
          width: 44,
          height: 44,
          fontSize: "1rem",
          fontWeight: 700,
          flexShrink: 0,
          boxShadow: `0 2px 8px ${avatarColor}40`,
        }}
      >
        {initial}
      </Avatar>
      <Box flex={1}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ color: avatarColor }}
          >
            {message.agentNameJa}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {person?.era}
          </Typography>
        </Box>
        <Card
          sx={{
            bgcolor: "white",
            border: `1px solid ${avatarColor}30`,
            borderLeft: `4px solid ${avatarColor}`,
            boxShadow: `0 2px 8px ${avatarColor}15`,
            "&:hover": {
              boxShadow: `0 4px 16px ${avatarColor}25`,
            },
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
            >
              {message.content}
              {message.isStreaming && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "2px",
                    height: "1em",
                    bgcolor: avatarColor,
                    ml: 0.5,
                    verticalAlign: "middle",
                    animation: "blink 1s step-end infinite",
                    "@keyframes blink": {
                      "0%, 100%": { opacity: 1 },
                      "50%": { opacity: 0 },
                    },
                  }}
                />
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
