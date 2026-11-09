require('dotenv').config();
const express = require('express');
const supabase = require('./config/supabaseClient');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. Rota GET Global: Listar todas as peças vintage (roupas)
app.get('/roupas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pecas_vintage')
      .select('*');

    if (error) {
      return res.status(500).json({ erro: 'Erro no banco de dados', detalhe: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha interna no servidor' });
  }
});

// 2. Rota GET com Filtro: Apenas vestuários de tamanho M
app.get('/roupas/tamanho-m', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pecas_vintage')
      .select('*')
      .ilike('tamanho', 'm'); 

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar peças do tamanho M' });
  }
});

// 3. Rota GET por ID com tratamento 404
app.get('/roupas/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('pecas_vintage')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: 'Peça de roupa não foi encontrada' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ erro: 'Falha na busca do recurso' });
  }
});

// Inicialização da escuta do servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis: http://localhost:${PORT}/roupas`);
});