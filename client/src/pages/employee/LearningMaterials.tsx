import { useEffect, useState } from 'react';
import { Close, ExpandMore, FilterList, LibraryBooks, MenuBook, School } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { useGetLearningMaterialsQuery } from '../../features/learning-materials/learningMaterialsApiSlice';
import { LearningMaterial } from '../../types/learningMaterial';
import { Specialization } from '../../types/specialization';

// Простая функция для форматирования текста в стиле markdown
const formatMarkdown = (text: string): string => {
  if (!text) return '';

  // Замена заголовков
  let formatted = text
    .replace(/#{6}\s?([^\n]+)/g, '<h6>$1</h6>')
    .replace(/#{5}\s?([^\n]+)/g, '<h5>$1</h5>')
    .replace(/#{4}\s?([^\n]+)/g, '<h4>$1</h4>')
    .replace(/#{3}\s?([^\n]+)/g, '<h3>$1</h3>')
    .replace(/#{2}\s?([^\n]+)/g, '<h2>$1</h2>')
    .replace(/#{1}\s?([^\n]+)/g, '<h1>$1</h1>');

  // Замена жирного текста
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Замена курсива
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Замена ссылок
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Замена списков
  formatted = formatted.replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>');

  // Замена новых строк на параграфы
  formatted = formatted.replace(/\n\n/g, '</p><p>');

  return `<p>${formatted}</p>`;
};

function LearningMaterials() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAppSelector(state => state.auth.user);

  // Состояния компонента
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Запрос данных с помощью RTK Query
  const { data: materials = [], isLoading, error } = useGetLearningMaterialsQuery();

  // Извлекаем уникальные специализации из полученных материалов
  useEffect(() => {
    if (materials && materials.length > 0) {
      const uniqueSpecializations = Array.from(
        new Map(
          materials
            .filter(material => material.specialization)
            .map(material => [material.specialization?.id, material.specialization])
        ).values()
      );
      setSpecializations(uniqueSpecializations as Specialization[]);
    }
  }, [materials]);

  // Обработчики событий
  const handleSpecializationChange = (specialization: string | null) => {
    setSelectedSpecialization(specialization);
  };

  const handleOpenMaterial = (material: LearningMaterial) => {
    setSelectedMaterial(material);
    setDialogOpen(true);
  };

  const handleCloseMaterial = () => {
    setDialogOpen(false);
  };

  // Фильтрация материалов по выбранной специализации
  const filteredMaterials = selectedSpecialization
    ? materials.filter(m => m.specialization?.id === selectedSpecialization)
    : materials;

  // Группировка материалов по специализациям для аккордеона
  const materialsBySpecialization = specializations.map(spec => ({
    specialization: spec,
    materials: materials.filter(m => m.specialization?.id === spec.id),
  }));

  // Обработка ошибок
  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          Произошла ошибка при загрузке учебных материалов
        </Typography>
        <Typography color="text.secondary">
          Пожалуйста, попробуйте обновить страницу или обратитесь к администратору
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Paper
        sx={{
          p: { xs: isXSmall ? 1 : 2, sm: 3 },
          mb: 3,
          borderRadius: { xs: isXSmall ? 0 : 1, sm: 1, md: 2 },
          boxShadow: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <LibraryBooks
            sx={{
              fontSize: { xs: isXSmall ? 24 : 28, sm: 32, md: 36 },
              color: 'primary.main',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 },
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: isXSmall ? '1.25rem' : '1.5rem', sm: '2rem', md: '2.125rem' },
              fontWeight: 'bold',
            }}
          >
            Учебные материалы
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Фильтр по специализациям для средних и больших экранов */}
            {!isMobile && specializations.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FilterList sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Специализации</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label="Все специализации"
                    variant={selectedSpecialization === null ? 'filled' : 'outlined'}
                    onClick={() => handleSpecializationChange(null)}
                    color={selectedSpecialization === null ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                  {specializations.map(spec => (
                    <Chip
                      key={spec.id}
                      label={spec.name}
                      variant={selectedSpecialization === spec.id ? 'filled' : 'outlined'}
                      onClick={() => handleSpecializationChange(spec.id || null)}
                      color={selectedSpecialization === spec.id ? 'primary' : 'default'}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Материалы аккордеоном для мобильных */}
            {isMobile && materialsBySpecialization.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {materialsBySpecialization.map(group => (
                  <Accordion
                    key={group.specialization.id}
                    defaultExpanded={materialsBySpecialization.length === 1}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`panel-${group.specialization.id}-content`}
                      id={`panel-${group.specialization.id}-header`}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <School
                          sx={{ mr: 1, fontSize: isXSmall ? 18 : 20, color: 'primary.main' }}
                        />
                        <Typography
                          variant={isXSmall ? 'body1' : 'h6'}
                          sx={{ fontSize: isXSmall ? '0.875rem' : undefined }}
                        >
                          {group.specialization.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={group.materials.length}
                          sx={{ ml: 1, height: isXSmall ? 20 : 24 }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: isXSmall ? 1 : 2 }}>
                      {group.materials.length > 0 ? (
                        <Box component="div">
                          {group.materials.map(material => (
                            <Card
                              key={material.id}
                              variant="outlined"
                              sx={{
                                mb: isXSmall ? 1 : 2,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <CardContent sx={{ p: isXSmall ? 1.5 : 2, pb: 0.5 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  gutterBottom
                                  sx={{
                                    fontSize: isXSmall ? '0.875rem' : '1rem',
                                    fontWeight: 'bold',
                                    mb: 1,
                                  }}
                                >
                                  {material.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontSize: isXSmall ? '0.75rem' : '0.875rem' }}
                                >
                                  {material.content.substring(0, 100)}...
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ p: isXSmall ? 1 : 1.5, pt: 0.5, mt: 'auto' }}>
                                <Button
                                  size={isXSmall ? 'small' : 'medium'}
                                  startIcon={<MenuBook />}
                                  onClick={() => handleOpenMaterial(material)}
                                  sx={{ fontSize: isXSmall ? '0.75rem' : undefined }}
                                >
                                  Читать
                                </Button>
                              </CardActions>
                            </Card>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                          Материалы отсутствуют
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : isMobile && materialsBySpecialization.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Материалы не найдены
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Нет доступных учебных материалов
                </Typography>
              </Box>
            ) : null}

            {/* Карточки материалов для средних и больших экранов */}
            {!isMobile && (
              <Box component="div">
                {filteredMaterials.length > 0 ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      },
                      gap: 2,
                    }}
                  >
                    {filteredMaterials.map(material => (
                      <Card
                        key={material.id}
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography
                              variant="h6"
                              component="h3"
                              gutterBottom
                              sx={{ fontWeight: 'medium' }}
                            >
                              {material.title}
                            </Typography>
                          </Box>
                          {material.specialization && (
                            <Chip
                              label={material.specialization.name}
                              size="small"
                              sx={{ mb: 2 }}
                              color="primary"
                              variant="outlined"
                            />
                          )}
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {material.content.substring(0, 150)}...
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ mt: 'auto', pt: 0 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<MenuBook />}
                            onClick={() => handleOpenMaterial(material)}
                            size="small"
                          >
                            Читать материал
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Материалы не найдены
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {selectedSpecialization
                        ? 'В выбранной специализации нет доступных материалов.'
                        : 'Нет доступных учебных материалов.'}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Диалоговое окно для просмотра материала */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseMaterial}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            m: { xs: isXSmall ? 0.5 : 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            maxHeight: { xs: '95vh', sm: '90vh' },
          },
        }}
      >
        <DialogTitle sx={{ p: { xs: isXSmall ? 1.5 : 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: isXSmall ? '1.1rem' : '1.25rem', sm: '1.5rem' },
                  fontWeight: 'bold',
                  mb: 0.5,
                }}
              >
                {selectedMaterial?.title}
              </Typography>
              {selectedMaterial && selectedMaterial.specialization && (
                <Typography variant="body2" color="text.secondary" component="div">
                  <Chip
                    label={selectedMaterial.specialization.name}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  {selectedMaterial.createdAt &&
                    new Date(selectedMaterial.createdAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
            <IconButton
              onClick={handleCloseMaterial}
              edge="end"
              aria-label="close"
              sx={{
                ml: 1,
                padding: { xs: isXSmall ? 0.4 : 0.5, sm: 1 },
              }}
            >
              <Close sx={{ fontSize: { xs: isXSmall ? '1.1rem' : '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            p: { xs: isXSmall ? 1.5 : 2, sm: 3 },
            '& img': { maxWidth: '100%' },
          }}
        >
          {selectedMaterial && (
            <Box
              dangerouslySetInnerHTML={{
                __html: formatMarkdown(selectedMaterial.content),
              }}
              sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  mt: 2,
                  mb: 1,
                  fontWeight: 'bold',
                },
                '& p': { mb: 1.5 },
                '& ul, & ol': { ml: 2, mb: 1.5 },
                '& a': { color: 'primary.main' },
              }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: { xs: isXSmall ? 1 : 1.5, sm: 2 } }}>
          <Button onClick={handleCloseMaterial} variant="outlined">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LearningMaterials;
