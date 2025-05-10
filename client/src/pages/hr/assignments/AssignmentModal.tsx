import { useEffect, useState } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { mockLearningMaterials } from '../../../types/learning-material';
import { AssignmentType, PersonType } from './AssignmentDashboard';

// Моковые данные тестов
const mockTests = [
  {
    id: 'test1',
    title: 'Базовые знания AutoCAD',
    description: 'Проверка базовых навыков работы с AutoCAD',
    difficulty: 'beginner',
    duration: 60,
    tags: ['AutoCAD', 'проектирование'],
  },
  {
    id: 'test2',
    title: 'Нормы и правила строительства',
    description: 'Проверка знаний актуальных СНиП и ГОСТ',
    difficulty: 'intermediate',
    duration: 90,
    tags: ['СНиП', 'ГОСТ', 'нормативы'],
  },
  {
    id: 'test3',
    title: 'Продвинутое моделирование в Revit',
    description: 'Проверка навыков работы в Revit',
    difficulty: 'advanced',
    duration: 120,
    tags: ['Revit', 'BIM', 'моделирование'],
  },
  {
    id: 'test4',
    title: 'Управление строительными проектами',
    description: 'Проверка знаний методологии управления проектами',
    difficulty: 'intermediate',
    duration: 90,
    tags: ['управление', 'проекты'],
  },
  {
    id: 'test5',
    title: 'Техника безопасности',
    description: 'Обязательный тест по технике безопасности',
    difficulty: 'beginner',
    duration: 45,
    tags: ['безопасность', 'инструктаж'],
  },
];

interface Person {
  id: string;
  name: string;
  position?: string;
  department?: string;
}

interface AssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: string[]) => void;
  person: Person;
  personType: PersonType;
  assignmentType: AssignmentType;
}

const AssignmentModal = ({
  open,
  onClose,
  onConfirm,
  person,
  personType,
  assignmentType,
}: AssignmentModalProps) => {
  const theme = useTheme();

  // Состояние для выбранных элементов
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('Все уровни');
  const [tagFilter, setTagFilter] = useState('Все теги');

  // Исходные данные и фильтрованные данные
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  // Собираем все доступные теги для фильтра
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Загружаем соответствующие данные при открытии
  useEffect(() => {
    const itemsData = assignmentType === 'test' ? mockTests : mockLearningMaterials;
    setItems(itemsData);

    // Собираем все теги
    const tags = new Set<string>();
    itemsData.forEach(item => {
      if (item.tags) {
        item.tags.forEach((tag: string) => tags.add(tag));
      }
    });

    setAvailableTags(['Все теги', ...Array.from(tags)]);

    // Сбрасываем выбранные элементы при каждом открытии
    setSelectedItems([]);
    setSearchQuery('');
    setDifficultyFilter('Все уровни');
    setTagFilter('Все теги');
  }, [open, assignmentType]);

  // Применяем фильтры
  useEffect(() => {
    let filtered = [...items];

    // Фильтр по поисковому запросу (название или описание)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Фильтр по сложности
    if (difficultyFilter !== 'Все уровни') {
      filtered = filtered.filter(item => item.difficulty === difficultyFilter.toLowerCase());
    }

    // Фильтр по тегу
    if (tagFilter !== 'Все теги') {
      filtered = filtered.filter(item => item.tags && item.tags.includes(tagFilter));
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, difficultyFilter, tagFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDifficultyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDifficultyFilter(event.target.value as string);
  };

  const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTagFilter(event.target.value as string);
  };

  const handleToggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('Все уровни');
    setTagFilter('Все теги');
  };

  const isFiltered = searchQuery || difficultyFilter !== 'Все уровни' || tagFilter !== 'Все теги';

  // Переведем сложность на русский
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      case 'expert':
        return 'Экспертный';
      default:
        return difficulty;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { maxHeight: '80vh' },
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          {assignmentType === 'test' ? (
            <AssignmentIcon color="primary" />
          ) : (
            <MenuBookIcon color="secondary" />
          )}
          <Typography variant="h6">
            Назначение {assignmentType === 'test' ? 'тестов' : 'учебных материалов'} для{' '}
            {person.name}
          </Typography>
        </Stack>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          {person.position}
          {person.department ? `, ${person.department}` : ''}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          {/* Фильтры */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  placeholder="Поиск по названию или описанию"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="difficulty-filter-label">Сложность</InputLabel>
                  <Select
                    labelId="difficulty-filter-label"
                    value={difficultyFilter}
                    label="Сложность"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="Все уровни">Все уровни</MenuItem>
                    <MenuItem value="Начальный">Начальный</MenuItem>
                    <MenuItem value="Средний">Средний</MenuItem>
                    <MenuItem value="Продвинутый">Продвинутый</MenuItem>
                    <MenuItem value="Экспертный">Экспертный</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tag-filter-label">Тег</InputLabel>
                  <Select
                    labelId="tag-filter-label"
                    value={tagFilter}
                    label="Тег"
                    onChange={handleTagChange}
                  >
                    {availableTags.map(tag => (
                      <MenuItem key={tag} value={tag}>
                        {tag}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {isFiltered && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">
                  Найдено: {filteredItems.length}{' '}
                  {assignmentType === 'test' ? 'тестов' : 'материалов'}
                </Typography>
                <Button size="small" onClick={handleClearFilters}>
                  Сбросить фильтры
                </Button>
              </Box>
            )}
          </Box>

          {/* Список элементов */}
          <Paper variant="outlined" sx={{ maxHeight: '50vh', overflow: 'auto' }}>
            {filteredItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Ничего не найдено
                </Typography>
              </Box>
            ) : (
              <List dense>
                <ListItem>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedItems.length === filteredItems.length && filteredItems.length > 0
                        }
                        indeterminate={
                          selectedItems.length > 0 && selectedItems.length < filteredItems.length
                        }
                        onChange={handleSelectAll}
                      />
                    }
                    label={`Выбрать все (${filteredItems.length})`}
                  />
                </ListItem>

                <Divider />

                {filteredItems.map(item => (
                  <ListItem key={item.id} divider>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            {item.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={getDifficultyLabel(item.difficulty)}
                              size="small"
                              color={
                                item.difficulty === 'beginner'
                                  ? 'success'
                                  : item.difficulty === 'intermediate'
                                    ? 'primary'
                                    : item.difficulty === 'advanced'
                                      ? 'secondary'
                                      : 'error'
                              }
                              variant="outlined"
                              sx={{ mr: 1, mb: 0.5 }}
                            />
                            {item.duration && (
                              <Chip
                                label={`${item.duration} мин`}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 1, mb: 0.5 }}
                              />
                            )}
                            {item.tags &&
                              item.tags.map((tag: string) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mb: 0.5 }}
                                />
                              ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 2, py: 1 }}>
          <Typography>
            Выбрано: {selectedItems.length}{' '}
            {selectedItems.length === 1
              ? assignmentType === 'test'
                ? 'тест'
                : 'материал'
              : assignmentType === 'test'
                ? 'тестов'
                : 'материалов'}
          </Typography>
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Отмена
            </Button>
            <Button
              variant="contained"
              color={assignmentType === 'test' ? 'primary' : 'secondary'}
              onClick={() => onConfirm(selectedItems)}
              disabled={selectedItems.length === 0}
            >
              Назначить
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
