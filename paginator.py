class Paginator:
    def __init__(self, page_number, page_size):
        self.page_no = page_number
        self.page_size = page_size

    def paginate_df(self, df):
        start_idx = (self.page_no - 1) * self.page_size
        end_idx = start_idx + self.page_size

        paginated_df = df.iloc[start_idx:end_idx].copy()
        paginated_df
        summary_json = paginated_df.to_dict(orient='records')

        output_json = {
            "count": len(df),
            "data": summary_json
        }
        return output_json