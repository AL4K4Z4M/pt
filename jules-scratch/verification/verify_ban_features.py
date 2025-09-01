# jules-scratch/verification/verify_ban_features.py
import os
import re
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Get the absolute path to the admin.html file
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        admin_html_path = os.path.join(base_dir, 'admin.html')

        # Navigate to the local file
        page.goto(f'file://{admin_html_path}')

        # Manually activate the tab and adjust style for screenshot
        page.evaluate("""
          () => {
            const id = 'bans';
            document.querySelectorAll('.tab-button').forEach(b => {
              const isBans = b.dataset.tab === id;
              b.classList.toggle('border-blue-600', isBans);
              b.classList.toggle('text-blue-700', isBans);
              b.classList.toggle('border-transparent', !isBans);
            });
            document.querySelectorAll('.tab-content').forEach(c => {
              c.classList.toggle('active', c.id === id);
            });

            // Remove the max-height from the table container to make it fully visible
            const tableContainer = document.querySelector('#bans .overflow-auto');
            if (tableContainer) {
              tableContainer.style.maxHeight = 'none';
            }
          }
        """)

        # Wait for the "Bans" tab content to become active and visible
        bans_section = page.locator("#bans")
        expect(bans_section).to_be_visible()

        # Take a screenshot of the "Bans" tab
        screenshot_path = "jules-scratch/verification/bans_tab.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run_verification()
