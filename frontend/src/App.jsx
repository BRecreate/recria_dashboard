import { useState, useEffect } from 'react'
import './App.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Progress } from './components/ui/progress'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  Users, Calendar, TrendingUp, MessageSquare, Clock, Target,
  Phone, Mail, CheckCircle, XCircle, RotateCcw, AlertCircle,
  Activity, BarChart3, PieChart as PieChartIcon, RefreshCw
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Cores para os gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

function App() {
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [recentClients, setRecentClients] = useState([])
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [statsRes, trendsRes, clientsRes, meetingsRes, performanceRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/stats`),
        fetch(`${API_BASE_URL}/api/dashboard/trends`),
        fetch(`${API_BASE_URL}/api/dashboard/recent-clients`),
        fetch(`${API_BASE_URL}/api/dashboard/upcoming-meetings`),
        fetch(`${API_BASE_URL}/api/dashboard/performance`)
      ])

      const [statsData, trendsData, clientsData, meetingsData, performanceData] = await Promise.all([
        statsRes.json(),
        trendsRes.json(),
        clientsRes.json(),
        meetingsRes.json(),
        performanceRes.json()
      ])

      setStats(statsData)
      setTrends(trendsData)
      setRecentClients(clientsData)
      setUpcomingMeetings(meetingsData)
      setPerformance(performanceData)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatLastUpdate = () => {
    return lastUpdate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - Agente de IA</h1>
              <p className="text-sm text-gray-500">
                Monitoramento em tempo real • Última atualização: {formatLastUpdate()}
              </p>
            </div>
            <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_clients || 0}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-green-600">+{stats?.new_clients || 0} novos</span>
                    <span>•</span>
                    <span>{stats?.returning_clients || 0} recorrentes</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reuniões Agendadas</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.scheduled_meetings || 0}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-blue-600">{stats?.rescheduled_meetings || 0} reagendadas</span>
                    <span>•</span>
                    <span className="text-red-600">{stats?.cancelled_meetings || 0} canceladas</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.scheduling_success_rate || 0}%</div>
                  <Progress value={stats?.scheduling_success_rate || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Média de Mensagens</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.avg_messages_per_interaction || 0}</div>
                  <p className="text-xs text-muted-foreground">por interação</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição de Interesses */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Interesses</CardTitle>
                  <CardDescription>Principais tópicos de interesse dos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats?.interests || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(stats?.interests || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status de Reuniões */}
              <Card>
                <CardHeader>
                  <CardTitle>Status de Reuniões</CardTitle>
                  <CardDescription>Comparação entre agendadas, reagendadas e canceladas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Agendadas', value: stats?.scheduled_meetings || 0, fill: '#00C49F' },
                        { name: 'Reagendadas', value: stats?.rescheduled_meetings || 0, fill: '#FFBB28' },
                        { name: 'Canceladas', value: stats?.cancelled_meetings || 0, fill: '#FF8042' }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tendências */}
          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contatos Diários */}
              <Card>
                <CardHeader>
                  <CardTitle>Novos Contatos por Dia</CardTitle>
                  <CardDescription>Evolução do número de novos clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends?.daily_contacts || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false}/>
                      <Tooltip />
                      <Area type="monotone" dataKey="contacts" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Horários de Pico */}
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Pico</CardTitle>
                  <CardDescription>Distribuição de interações por horário</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={trends?.peak_hours || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis allowDecimals={false}/>
                      <Tooltip />
                      <Bar dataKey="interactions" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Tendências de Reuniões */}
            <Card>
              <CardHeader>
                <CardTitle>Tendências de Reuniões</CardTitle>
                <CardDescription>Evolução dos agendamentos, reagendamentos e cancelamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trends?.meeting_trends || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Line type="monotone" dataKey="scheduled" stroke="#00C49F" strokeWidth={2} name="Agendadas" />
                    <Line type="monotone" dataKey="rescheduled" stroke="#FFBB28" strokeWidth={2} name="Reagendadas" />
                    <Line type="monotone" dataKey="cancelled" stroke="#FF8042" strokeWidth={2} name="Canceladas" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Métricas de Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Tempo Médio para Agendamento</CardTitle>
                  <CardDescription>Desde o primeiro contato até a confirmação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performance?.avg_time_to_schedule || 0}</div>
                  <p className="text-sm text-muted-foreground">dias</p>
                </CardContent>
              </Card>

              {/* Taxa de Conversão */}
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Conversão</CardTitle>
                  <CardDescription>Lead qualificado para reunião</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.lead_to_meeting_rate || 0}%</div>
                  <Progress value={stats?.lead_to_meeting_rate || 0} className="mt-2" />
                </CardContent>
              </Card>

              {/* Status de Leads */}
              <Card>
                <CardHeader>
                  <CardTitle>Status de Leads</CardTitle>
                  <CardDescription>Distribuição por status de qualificação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(performance?.lead_status || []).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{item.status.replace('_', ' ')}</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tópicos Mais Abordados */}
              <Card>
                <CardHeader>
                  <CardTitle>Tópicos Mais Abordados</CardTitle>
                  <CardDescription>Principais assuntos nas conversas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performance?.top_topics || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="topic" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Taxa de Resposta por Dia */}
              <Card>
                <CardHeader>
                  <CardTitle>Taxa de Resposta por Dia</CardTitle>
                  <CardDescription>Eficiência do agente por dia da semana</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performance?.response_rate_by_day || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detalhes */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clientes Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle>Clientes Recentes</CardTitle>
                  <CardDescription>Últimos contatos registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClients.map((client, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{client.nome_completo}</h4>
                          <p className="text-sm text-muted-foreground">{client.interesse_principal}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Phone className="h-3 w-3" />
                            <span className="text-xs">{client.telefone_wpp}</span>
                            <Mail className="h-3 w-3 ml-2" />
                            <span className="text-xs">{client.email_contato}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              client.status_lead === 'qualificado' ? 'default' :
                              client.status_lead === 'nao_qualificado' ? 'destructive' : 'secondary'
                            }
                          >
                            {client.status_lead?.replace('_', ' ')}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {client.total_mensagens} mensagens
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Próximas Reuniões */}
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Reuniões</CardTitle>
                  <CardDescription>Agendamentos confirmados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{meeting.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{meeting.start_time}</span>
                            {meeting.is_rescheduled && (
                              <Badge variant="outline" className="text-xs">
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Reagendada
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {meeting.attendees.length} participante(s)
                          </p>
                        </div>
                        <div className="text-right">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

