"use client";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Chip,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { GreatPerson } from "../types";
import { GREAT_PERSONS } from "../data/greatPersons";

type Props = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  contextDepth: number;
  onContextDepthChange: (value: number) => void;
  disabled: boolean;
};

export default function AgentSelector({
  selectedIds,
  onToggle,
  contextDepth,
  onContextDepthChange,
  disabled,
}: Props) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2} color="text.primary">
        参加エージェントを選択
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 1.5,
          mb: 3,
        }}
      >
        {GREAT_PERSONS.map((person) => {
          const selected = selectedIds.includes(person.id);
          return (
            <Card
              key={person.id}
              sx={{
                border: selected ? `2px solid ${person.avatarColor}` : "2px solid transparent",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                background: selected
                  ? `${person.avatarColor}10`
                  : "background.paper",
              }}
            >
              <CardActionArea
                onClick={() => !disabled && onToggle(person.id)}
                disabled={disabled}
                sx={{ p: 0 }}
              >
                <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Box position="relative">
                      <Avatar
                        sx={{
                          bgcolor: person.avatarColor,
                          width: 40,
                          height: 40,
                          fontSize: "1rem",
                          fontWeight: 700,
                        }}
                      >
                        {person.avatarInitial}
                      </Avatar>
                      {selected && (
                        <CheckCircleIcon
                          sx={{
                            position: "absolute",
                            bottom: -4,
                            right: -4,
                            fontSize: 18,
                            color: person.avatarColor,
                            bgcolor: "white",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </Box>
                    <Box flex={1} minWidth={0}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        color="text.primary"
                      >
                        {person.nameJa}
                      </Typography>
                      <Chip
                        label={person.field}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          bgcolor: `${person.avatarColor}20`,
                          color: person.avatarColor,
                          fontWeight: 600,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {person.era}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            文脈の深さ
          </Typography>
          <Chip
            label={contextDepth === 0 ? "なし" : `直近 ${contextDepth} 発言`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        <Slider
          value={contextDepth}
          onChange={(_, v) => onContextDepthChange(v as number)}
          min={0}
          max={20}
          step={2}
          marks={[
            { value: 0, label: "0" },
            { value: 6, label: "6" },
            { value: 12, label: "12" },
            { value: 20, label: "全て" },
          ]}
          disabled={disabled}
          sx={{ color: "primary.main" }}
        />
        <Typography variant="caption" color="text.secondary">
          各エージェントが参照する過去の会話数。0だと文脈なしで独立して発言します。
        </Typography>
      </Box>
    </Box>
  );
}
