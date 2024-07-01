using Dapper;
using MySql.Data.MySqlClient;
using TechChallenge.Core.Entities;
using TechChallenge.Core.Interfaces;

namespace TechChallenge.Infrastructure.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly string _connectionString = "server=localhost;port=3306;database=payment_processing;User=root;Password=Caralho!1";
        public async Task<dynamic> InsertTransaction(AuthorizationRequest request, string paymentId)
        {
            using var connection = new MySqlConnection(_connectionString);
            string query = @"INSERT INTO transactions (merchant_id, description, payment_method, card_number, card_holder_name, card_expiration_date, card_cvv, payment_id) 
                     VALUES (@MerchantId, @Description, @PaymentMethod, @CardNumber, @CardHolderName, @CardExpirationDate, @CardCVV, @PaymentId)";

            var parameters = new
            {
                request.MerchantId,
                request.Description,
                request.PaymentMethod,
                request.CardNumber,
                request.CardHolderName,
                request.CardExpirationDate,
                request.CardCVV,
                PaymentId = paymentId
            };

            return await connection.ExecuteAsync(query, parameters);
        }
    }
}
