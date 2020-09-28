# Recuperação de senha

**Requisitos Funcionais**

- O usuário deve porder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar a sua senha; 

**Requisitos não Funcionais**

- Utilizar o MailTrap para testar envios em ambiente de dev;
- Utilizar Amaozn SES para envios em produção;
- O envio de email deve acontecer em segundo plano (backgroud job);

**Regras de negócios**

- O link enviado por email para resetar a senha, deve expirar em 2h;
- O usuário precisa confirmar sua nova senha;

# Atualização do perfil

**Requisitos Funcionais**

- O usuário deve poder atualizar seu nome, email e senha;

**Requisitos não Funcionais**

**Regras de negócios**

- O usuário não pode alterar o seu email, para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar sua senha antiga;
- Para atualizar sua senha, o usuário precisa confirmar a nova senha;

# Painel do prestador

**Requisitos Funcionais**

- O prestador deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamentos;
- O prestador deve poder visualizar as notificações ainda não lidas

**Requisitos não Funcionais**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações devem ser enviadas em real-time utilizanod Socket.io;

**Regras de negócios**

- A notificação deve ter um status de lida ou não-lida;

# agendamentos de serviços

**Requisitos Funcionais**

- O usuário deve poder listar todos os prestadores de servições cadastrados;
- O usuário de poder listar os dias de um mês com pelo menos um horário disponível de um prestador de serviços;
- O usuário pode poder listar os horários disponíveis em um dia específico de um prestador de serviços;
- O usuário deve poder realizar um novo agendamento;

**Requisitos não Funcionais**

- A listagem de prestadores deve ser armazenadas em cache;


**Regras de negócios**

- Cada agendamento deve durar 1h exatamento;
- Os agendamentos devem estar disponíveis entre as 8h às 18h;
- O usuário não pode agendar em um horário já marcado;
- O usuário não pode agendar em horários que já passaram;
- O usuário não pode marcar com ele mesmo;
