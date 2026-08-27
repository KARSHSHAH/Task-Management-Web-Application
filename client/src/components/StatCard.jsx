import { Card, CardContent, Typography, Box, Avatar, CardActionArea } from '@mui/material';

const StatCard = ({ title, value, icon, color, onClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 2, borderRadius: 2 }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {value}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, width: 48, height: 48 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StatCard;
