import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from '../i18n/i18n';
import { transactionsAPI, aiAPI } from '../services/api';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Mic as MicIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CalendarToday as CalendarTodayIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsRes = await transactionsAPI.getAll();
        setTransactions(transactionsRes.data);

        // Fetch summary
        const summaryRes = await transactionsAPI.getSummary();
        setSummary(summaryRes.data);

        // Fetch categories
        const categoriesRes = await transactionsAPI.getCategories();
        setCategories(categoriesRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAiQuerySubmit = async () => {
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    try {
      const response = await aiAPI.getFinanceAdvice(transactions, aiQuery);
      setAiResponse(response.data.advice);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse('Sorry, I encountered an error processing your request.');
    } finally {
      setAiLoading(false);
    }
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
        const transcript = event.results[0][0].transcript;
        setAiQuery(transcript);
        
        // Process language-specific voice commands
        if (transcript.toLowerCase().includes('add transaction') || 
            transcript.toLowerCase().includes('new transaction') ||
            transcript.includes('लेनदेन जोड़ें') || transcript.includes('नया लेनदेन') ||
            transcript.includes('व्यवहार जोडा') || transcript.includes('नवीन व्यवहार')) {
          window.location.href = '/transactions/add';
          return;
        } else if (transcript.toLowerCase().includes('show transactions') || 
                   transcript.toLowerCase().includes('view transactions') ||
                   transcript.includes('लेनदेन दिखाएं') || transcript.includes('लेनदेन देखें') ||
                   transcript.includes('व्यवहार दाखवा') || transcript.includes('व्यवहार पहा')) {
          window.location.href = '/transactions';
          return;
        }
        
        // Automatically submit after voice input
        setTimeout(() => {
          handleAiQuerySubmit();
        }, 500);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!categories) return null;

    const categoryNames = Object.keys(categories);
    const expenseData = categoryNames.map(cat => categories[cat].expense);
    const incomeData = categoryNames.map(cat => categories[cat].income);

    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC249', '#EA5F89', '#00D8B6', '#FFB7B2'
    ];

    return {
      labels: categoryNames,
      expenseData,
      incomeData,
      backgroundColors: backgroundColors.slice(0, categoryNames.length)
    };
  };

  const chartData = prepareChartData();

  return (
    <Container maxWidth="lg">
      {/* Welcome Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #2196f3 0%, #1769aa 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  width: 56, 
                  height: 56, 
                  mr: 2,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                  {t('welcome')}, {user?.name || t('user')}!
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  {new Date().toLocaleDateString(t('locale') || 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mt: 2, opacity: 0.9, maxWidth: '90%' }}>
              {t('dashboard.overview')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<MicIcon />}
              onClick={() => setAiDialogOpen(true)}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
                backdropFilter: 'blur(4px)',
                color: 'white',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
              }}
            >
              {t('ask_ai_assistant')}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="medium" sx={{ mb: 2 }}>
            {t('financial_summary')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
              <AccountBalanceIcon sx={{ fontSize: 100, color: 'primary.main' }} />
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">{t('balance')}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ my: 2 }}>₹{summary?.balance.toFixed(2) || '0.00'}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip 
                  size="small" 
                  label={t('current_balance')} 
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'white',
                    fontWeight: 'medium',
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {t('updated_today')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
              <TrendingUpIcon sx={{ fontSize: 100, color: 'success.main' }} />
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">{t('income')}</Typography>
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold" sx={{ my: 2 }}>
                ₹{summary?.totalIncome.toFixed(2) || '0.00'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip 
                  size="small" 
                  label={t('monthly_total')} 
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'white',
                    fontWeight: 'medium',
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {t('this_month')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 10, right: 10, opacity: 0.1 }}>
              <TrendingDownIcon sx={{ fontSize: 100, color: 'error.main' }} />
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <TrendingDownIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">{t('expenses')}</Typography>
              </Box>
              <Typography variant="h4" color="error.main" fontWeight="bold" sx={{ my: 2 }}>
                ₹{summary?.totalExpenses.toFixed(2) || '0.00'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip 
                  size="small" 
                  label={t('monthly_total')} 
                  sx={{ 
                    bgcolor: 'error.light', 
                    color: 'white',
                    fontWeight: 'medium',
                  }} 
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {t('this_month')}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom fontWeight="medium">
            {t('financial_analytics')}
          </Typography>
        </Grid>
        
        {/* Expense Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>{t('expense_distribution')}</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {chartData && chartData.expenseData.some(val => val > 0) ? (
                  <Doughnut
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          data: chartData.expenseData,
                          backgroundColor: chartData.backgroundColors,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No expense data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Income vs Expenses Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>{t('income_vs_expenses')}</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {chartData && (chartData.incomeData.some(val => val > 0) || chartData.expenseData.some(val => val > 0)) ? (
                  <Bar
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: 'Income',
                          data: chartData.incomeData,
                          backgroundColor: 'rgba(75, 192, 192, 0.6)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                        },
                        {
                          label: 'Expenses',
                          data: chartData.expenseData,
                          backgroundColor: 'rgba(255, 99, 132, 0.6)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            drawBorder: false,
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="medium">
              {t('recent_transactions')}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              href="/transactions"
              sx={{ borderRadius: 2 }}
            >
              View All
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              {transactions.length > 0 ? (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('date')}</TableCell>
                        <TableCell>{t('type')}</TableCell>
                        <TableCell>{t('category')}</TableCell>
                        <TableCell>{t('description')}</TableCell>
                        <TableCell align="right">{t('amount')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.slice(0, 5).map((transaction) => (
                        <TableRow key={transaction._id} sx={{
                          '&:hover': { bgcolor: 'action.hover' },
                          transition: 'background-color 0.2s',
                        }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: 'action.hover', width: 30, height: 30, mr: 1 }}>
                                <CalendarTodayIcon fontSize="small" />
                              </Avatar>
                              {new Date(transaction.date).toLocaleDateString()}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.type}
                              size="small"
                              color={transaction.type === 'income' ? 'success' : 'error'}
                              sx={{ 
                                fontWeight: 'bold',
                                textTransform: 'capitalize',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: 'action.hover', width: 30, height: 30, mr: 1 }}>
                                <CategoryIcon fontSize="small" />
                              </Avatar>
                              {transaction.category}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ bgcolor: 'action.hover', width: 30, height: 30, mr: 1 }}>
                                <DescriptionIcon fontSize="small" />
                              </Avatar>
                              {transaction.description}
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{
                            color: transaction.type === 'income' ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <Avatar sx={{ 
                                bgcolor: transaction.type === 'income' ? 'success.light' : 'error.light', 
                                width: 30, 
                                height: 30, 
                                mr: 1 
                              }}>
                                <CurrencyRupeeIcon fontSize="small" />
                              </Avatar>
                              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      No transactions found
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      href="/transactions"
                      sx={{ borderRadius: 2 }}
                    >
                      Add Your First Transaction
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      {/* AI Dialog */}
      <Dialog 
        open={aiDialogOpen} 
        onClose={() => setAiDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 2,
          display: 'flex',
          alignItems: 'center',
        }}>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
            <MicIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">Ask AI Financial Assistant</Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Ask me anything about your finances. I can analyze your spending patterns, suggest budgeting strategies, or help you understand your financial habits.
          </Typography>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Ask a question about your finances"
              variant="outlined"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="E.g., How much did I spend on food last month?"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                    color="primary"
                    sx={{ 
                      bgcolor: isListening ? 'rgba(33, 150, 243, 0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.2)' } 
                    }}
                  >
                    <MicIcon />
                  </IconButton>
                ),
              }}
            />
          </Box>
          {aiResponse && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                bgcolor: 'rgba(33, 150, 243, 0.05)', 
                borderRadius: 2,
                border: '1px solid rgba(33, 150, 243, 0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: 'primary.main',
                  borderTopLeftRadius: 2,
                  borderBottomLeftRadius: 2,
                }
              }}
            >
              <Typography variant="body1" sx={{ pl: 1 }}>{aiResponse}</Typography>
            </Paper>
          )}
          {aiLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3, flexDirection: 'column' }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">Analyzing your financial data...</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
          <Button 
            onClick={() => setAiDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
          <Button 
            onClick={handleAiQuerySubmit} 
            variant="contained" 
            color="primary" 
            disabled={!aiQuery.trim() || aiLoading}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;