import mplcursors
import matplotlib.pyplot as plt

def visualize_outliers(data_df, outliers):
    """
    Function to visualize outliers in the original scale using a scatter plot with hover functionality.
    
    Parameters:
        data_df (DataFrame): Original DataFrame containing the data.
        outliers (dict): Dictionary containing information about detected outliers in the original scale.
    """
    # Exclude day and month number columns
    numeric_columns = [col for col in data_df.columns if col not in ['DayNumber', 'MonthNumber']]

    # Plot outliers for each numeric column
    for col in numeric_columns:
        if col not in outliers:
            continue
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.scatter(data_df.index, data_df[col], label='Data')
        outlier_points = ax.scatter(outliers[col].index, outliers[col].values, color='red', label='Outliers')

        # Add hover functionality to show actual values
        mplcursors.cursor(outlier_points).connect(
            "add", lambda sel, col=col: sel.annotation.set_text(f"{col}: {sel.target[1]:.2f}\nMonthName: {data_df['MonthName'].iloc[int(sel.target[0])]}")
        )

        ax.set_title(f'Outliers Detected in {col}')
        ax.set_xlabel('Index')
        ax.set_ylabel(col)
        ax.legend()

    plt.show()

