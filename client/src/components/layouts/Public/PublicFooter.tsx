import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../../../assets/images/logoNNGP.svg';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#222',
  color: '#fff',
  padding: theme.spacing(6, 0, 3),
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  fontSize: '1.1rem',
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#fff',
  opacity: 0.8,
  textDecoration: 'none',
  transition: 'opacity 0.2s',
  display: 'block',
  marginBottom: theme.spacing(1),
  '&:hover': {
    opacity: 1,
    textDecoration: 'none',
  },
}));

const FooterText = styled(Typography)(({ theme }) => ({
  opacity: 0.8,
  marginBottom: theme.spacing(1),
  fontSize: '0.9rem',
}));

const FooterBottom = styled(Box)(({ theme }) => ({
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const Logo = styled('img')(({ theme }) => ({
  height: 40,
  marginRight: theme.spacing(2),
}));

const PublicFooter = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Контактная информация */}
          <Grid item xs={12} md={4}>
            <FooterSection>
              <FooterTitle variant="h6">Контактная информация</FooterTitle>
              <FooterText>+7 (831) 266-07-77</FooterText>

              <Box mt={2}>
                <FooterTitle variant="subtitle1">Юридический адрес:</FooterTitle>
                <FooterText>
                  603000, Российская Федерация, Нижегородская область, г. Нижний Новгород, ул. Малая
                  Ямская, д. 18, пом. П2, офис 22
                </FooterText>
              </Box>

              <Box mt={2}>
                <FooterTitle variant="subtitle1">Фактический адрес:</FooterTitle>
                <FooterText>
                  603024, Российская Федерация, Нижегородская область, г. Нижний Новгород, ул.
                  Максима Горького, д. 117, этаж 2, 13, 14
                </FooterText>
                <FooterText>
                  603024, Российская Федерация, Нижегородская область, г. Нижний Новгород, ул.
                  Тургенева, д. 30, корпус 6
                </FooterText>
              </Box>
            </FooterSection>
          </Grid>

          {/* Офисы в других городах */}
          <Grid item xs={12} md={4}>
            <FooterSection>
              <FooterTitle variant="h6">Адреса офисов</FooterTitle>

              <Box mb={2}>
                <FooterTitle variant="subtitle1">Адрес офиса в г. Ставрополь:</FooterTitle>
                <FooterText>
                  Центр газохимических технологий, альтернативной энергетики и экологии
                </FooterText>
                <FooterText>
                  355035, Российская Федерация, Ставропольский край, г. Ставрополь, ул. Маршала
                  Жукова, д. 7
                </FooterText>
                <FooterText>Телефон: +7 (865) 220 55 30</FooterText>
              </Box>

              <Box>
                <FooterTitle variant="subtitle1">Адрес офиса в г. Дзержинск:</FooterTitle>
                <FooterText>
                  606000, Российская Федерация, Нижегородская область, г. Дзержинск, ул. Кирова, д.
                  11а
                </FooterText>
              </Box>
            </FooterSection>
          </Grid>

          {/* Ссылки на разделы сайта */}
          
        </Grid>

        {/* Нижняя часть футера */}
        <FooterBottom>
          <Box display="flex" alignItems="center">
            <Logo src={logo} alt="НИЖЕГОРОДНЕФТЕГАЗПРОЕКТ" />
            <FooterText>© 2025 ООО «ННГП»</FooterText>
          </Box>
          <Box>
            <FooterLink href="/privacy-policy">
              Политика конфиденциальности и защиты персональных данных
            </FooterLink>
            <FooterText>info@nngproekt.ru</FooterText>
          </Box>
        </FooterBottom>
      </Container>
    </FooterContainer>
  );
};

export default PublicFooter;
