import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18n';
import { transactionsAPI } from '../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mic as MicIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarTodayIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  DirectionsCar as TransportIcon,
  Home as HomeIcon,
  Lightbulb as UtilitiesIcon,
  Theaters as EntertainmentIcon,
  LocalHospital as HealthcareIcon,
  School as EducationIcon,
  LocalMall as ShoppingIcon,
  Person as PersonalIcon,
  Work as SalaryIcon,
  TrendingUp as InvestmentIcon,
  CardGiftcard as GiftIcon,
  MoreHoriz as OtherIcon,
  Fastfood as FoodIcon,
} from '@mui/icons-material';

const Transactions = () => {
  const { t } = useTranslation();
  // Function to get the appropriate icon for each category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Food':
        return <FoodIcon fontSize="small" />;
      case 'Transportation':
        return <TransportIcon fontSize="small" />;
      case 'Housing':
        return <HomeIcon fontSize="small" />;
      case 'Utilities':
        return <UtilitiesIcon fontSize="small" />;
      case 'Entertainment':
        return <EntertainmentIcon fontSize="small" />;
      case 'Healthcare':
        return <HealthcareIcon fontSize="small" />;
      case 'Education':
        return <EducationIcon fontSize="small" />;
      case 'Shopping':
        return <ShoppingIcon fontSize="small" />;
      case 'Personal':
        return <PersonalIcon fontSize="small" />;
      case 'Salary':
        return <SalaryIcon fontSize="small" />;
      case 'Investment':
        return <InvestmentIcon fontSize="small" />;
      case 'Gift':
        return <GiftIcon fontSize="small" />;
      case 'Other':
      default:
        return <OtherIcon fontSize="small" />;
    }
  };
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
    'Healthcare', 'Education', 'Shopping', 'Personal', 'Salary', 'Investment',
    'Gift', 'Other'
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await transactionsAPI.getAll();
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (currentTransaction) {
        // Update transaction
        await transactionsAPI.update(currentTransaction._id, formData);
      } else {
        // Add new transaction
        await transactionsAPI.add(formData);
      }
      fetchTransactions();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await transactionsAPI.delete(currentTransaction._id);
      fetchTransactions();
      setDeleteDialogOpen(false);
      setCurrentTransaction(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setCurrentTransaction(transaction);
      setFormData({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setCurrentTransaction(null);
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentTransaction(null);
  };

  const handleOpenDeleteDialog = (transaction) => {
    setCurrentTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Set language based on current UI language
      const currentLang = t('locale') || 'en-US';
      recognition.lang = currentLang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const processVoiceCommand = (command) => {
    console.log('Voice command:', command);
    
    // Process add transaction commands in multiple languages
    // English commands
    if (command.includes('add') || command.includes('create') || command.includes('new') ||
        // Hindi commands
        command.includes('जोड़ें') || command.includes('बनाएं') || command.includes('नया') ||
        // Marathi commands
        command.includes('जोडा') || command.includes('तयार करा') || command.includes('नवीन')) {
      // Open the dialog
      handleOpenDialog();
      
      // Try to extract transaction details
      const amountMatch = command.match(/₹(\d+(\.\d+)?)/) || command.match(/(\d+(\.\d+)?) rupees/) ||
                         command.match(/(\d+(\.\d+)?) रुपये/) || command.match(/(\d+(\.\d+)?) रुपए/);
      if (amountMatch) {
        setFormData(prev => ({ ...prev, amount: amountMatch[1] }));
      }
      
      // Check for expense or income in multiple languages
      if (command.includes('income') || command.includes('earning') || command.includes('salary') ||
          command.includes('आय') || command.includes('कमाई') || command.includes('वेतन') ||
          command.includes('उत्पन्न') || command.includes('पगार')) {
        setFormData(prev => ({ ...prev, type: 'income' }));
      }
      
      // Check for categories
      categories.forEach(category => {
        if (command.toLowerCase().includes(category.toLowerCase())) {
          setFormData(prev => ({ ...prev, category }));
        }
      });
      
      // Extract description
      const descriptionMatch = command.match(/for ([^₹]+)/) || command.match(/के लिए ([^₹]+)/) || command.match(/साठी ([^₹]+)/);
      if (descriptionMatch) {
        setFormData(prev => ({ ...prev, description: descriptionMatch[1].trim() }));
      }
    } else if (command.toLowerCase().includes('filter') || 
               command.toLowerCase().includes('फ़िल्टर') || 
               command.toLowerCase().includes('छानें') || 
               command.toLowerCase().includes('फिल्टर') || 
               command.toLowerCase().includes('निवडा')) {
      // Show filters section
      // This would be implemented if we had filter state management
      const filterSection = document.querySelector('.MuiCardContent-root');
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
                <CurrencyRupeeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {t('transactions')}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, mb: 1 }}>
              {t('transactions_description')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <IconButton 
              color="inherit" 
              onClick={startVoiceRecognition}
              sx={{ 
                mr: 1, 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' },
                transition: 'all 0.2s',
              }}
            >
              <MicIcon sx={{ color: isListening ? 'red' : 'white' }} />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                transition: 'all 0.2s',
              }}
            >
              {t('add_transaction')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">{t('filter_transactions')}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label={t('type')}
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    select
                    fullWidth
                    label={t('category')}
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="From Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="To Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">Transaction History</Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ borderRadius: 2 }}
            >
              Add Transaction
            </Button>
          </Box>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      Date
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      Category
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      Description
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <CurrencyRupeeIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                      Amount
                    </Box>
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow 
                      key={transaction._id}
                      sx={{
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 1.5, 
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              fontSize: '0.75rem',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CalendarTodayIcon sx={{ fontSize: '0.875rem', mb: 0.25 }} />
                            {new Date(transaction.date).getDate()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(transaction.date).getFullYear()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={transaction.type === 'income' ? 
                            <TrendingUpIcon fontSize="small" /> : 
                            <TrendingDownIcon fontSize="small" />}
                          label={transaction.type}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light',
                            color: transaction.type === 'income' ? 'success.dark' : 'error.dark',
                            borderRadius: 1,
                            '& .MuiChip-icon': {
                              color: transaction.type === 'income' ? 'success.dark' : 'error.dark',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={getCategoryIcon(transaction.category)}
                          label={transaction.category}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderRadius: 1,
                            '& .MuiChip-icon': {
                              fontSize: '1rem',
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {transaction.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          sx={{
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                          }}
                        >
                          ₹{transaction.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(transaction)}
                          size="small"
                          sx={{ 
                            mx: 0.5,
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                            '&:hover': { bgcolor: 'primary.main', color: 'white' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteDialog(transaction)}
                          size="small"
                          sx={{ 
                            mx: 0.5,
                            bgcolor: 'error.light',
                            color: 'error.dark',
                            '&:hover': { bgcolor: 'error.main', color: 'white' },
                            transition: 'all 0.2s',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}>
                          <CurrencyRupeeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No transactions found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                          Start tracking your finances by adding your first transaction. It's easy and quick!
                        </Typography>
                        <Button 
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenDialog()}
                          sx={{ borderRadius: 2, px: 3, py: 1 }}
                        >
                          Add Your First Transaction
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </Container>

      {/* Add/Edit Transaction Dialog */}
    <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: currentTransaction ? 'primary.main' : 'secondary.main', 
          color: 'white',
          py: 2,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Avatar sx={{ bgcolor: 'white', color: currentTransaction ? 'primary.main' : 'secondary.main', mr: 2 }}>
            {currentTransaction ? <EditIcon /> : <AddIcon />}
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {currentTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ color: 'text.secondary', mr: 1 }}>₹</Box>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="income">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'success.light', color: 'success.dark', fontSize: '0.75rem' }}>
                        <TrendingUpIcon fontSize="small" />
                      </Avatar>
                      Income
                    </Box>
                  </MenuItem>
                  <MenuItem value="expense">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'error.light', color: 'error.dark', fontSize: '0.75rem' }}>
                        <TrendingDownIcon fontSize="small" />
                      </Avatar>
                      Expense
                    </Box>
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 1, 
                            width: 24, 
                            height: 24, 
                            bgcolor: 'primary.light',
                            color: 'primary.dark',
                          }} 
                        >
                          {getCategoryIcon(category)}
                        </Avatar>
                        {category}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a note about this transaction"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            color={currentTransaction ? 'primary' : 'secondary'}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {currentTransaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            maxWidth: 400,
            mx: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.main', 
          color: 'white',
          py: 2,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Avatar sx={{ bgcolor: 'white', color: 'error.main', mr: 2 }}>
            <DeleteIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">Confirm Delete</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </Typography>
          {currentTransaction && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(0, 0, 0, 0.03)', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}>
              <Box sx={{ mr: 2 }}>
                <Chip 
                  label={currentTransaction.type}
                  size="small"
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 'bold',
                    bgcolor: currentTransaction.type === 'income' ? 'success.light' : 'error.light',
                    color: currentTransaction.type === 'income' ? 'success.dark' : 'error.dark',
                    mb: 1
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {currentTransaction.category}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {currentTransaction.description || 'No description'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(currentTransaction.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: currentTransaction.type === 'income' ? 'success.main' : 'error.main',
                  fontWeight: 'bold',
                }}
              >
                ₹{currentTransaction.amount.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDelete}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
   );
};

export default Transactions;