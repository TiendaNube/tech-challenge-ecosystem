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

            decimal totalPaid = 0m, totalFeesPaid = 0m, totalToReceive = 0m;

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
                        while (await reader.ReadAsync())
                        {
                            var status = reader["status"].ToString();
                            var totalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount"));
                            var totalFees = reader.GetDecimal(reader.GetOrdinal("TotalFees"));

                            if (status == "paid")
                            {
                                totalPaid += totalAmount;
                                totalFeesPaid += totalFees;
                            }
                            else if (status == "waiting_funds")
                            {
                                totalToReceive += totalAmount;
                            }
                        }
                    }
                }
            }

            return new
            {
                TotalPaid = totalPaid,
                TotalFeesPaid = totalFeesPaid,
                TotalToReceive = totalToReceive
            };
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