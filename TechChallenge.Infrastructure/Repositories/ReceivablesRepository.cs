using Dapper;
using MySql.Data.MySqlClient;
using TechChallenge.Core.Entities;
using TechChallenge.Core.Interfaces;

namespace TechChallenge.Infrastructure.Repositories
{
    public class ReceivablesRepository : IReceivablesRepository
    {
        private readonly string _connectionString = "server=localhost;port=3306;database=payment_processing;User=root;Password=Caralho!1";

        public async Task<dynamic> SelectReceivablesByMerchantId(string merchantId)
        {
            var query = @"
                SELECT 
                    status,
                    SUM(total) AS TotalAmount,
                    SUM(discount) AS TotalFees
                FROM payables
                WHERE merchant_id = @MerchantId
                AND create_date BETWEEN @StartDate AND @EndDate
                GROUP BY status;";

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@MerchantId", merchantId);
                    command.Parameters.AddWithValue("@StartDate", DateTime.UtcNow);
                    command.Parameters.AddWithValue("@EndDate", DateTime.UtcNow.AddDays(31));

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        dynamic result = new
                        {
                            TotalPaid = 0m,
                            TotalFeesPaid = 0m,
                            TotalToReceive = 0m
                        };

                        while (await reader.ReadAsync())
                        {
                            var status = reader["status"].ToString();
                            var totalAmount = (decimal)reader["TotalAmount"];
                            var totalFees = (decimal)reader["TotalFees"];

                            if (status == "paid")
                            {
                                result.TotalPaid += totalAmount;
                                result.TotalFeesPaid += totalFees;
                            }
                            else if (status == "waiting_funds")
                            {
                                result.TotalToReceive += totalAmount;
                            }
                        }

                        return result;
                    }
                }
            }
        }

        public async Task<int> InsertReceivableAsync(string merchantId, string status, Decimal total, Decimal discount, DateTime createDate, Decimal transactionAmount)
        {
            var query = @"
                INSERT INTO payables (merchant_id, status, create_date, subtotal, discount, total)
                VALUES (@MerchantId, @Status, @CreateDate, @Subtotal, @Discount, @Total);";

            using var connection = new MySqlConnection(_connectionString);

            var parameters = new
            {
                merchantId,
                status,
                createDate,
                subtotal = transactionAmount,
                discount,
                total
            };

            return await connection.ExecuteAsync(query, parameters);
        }
    }
}