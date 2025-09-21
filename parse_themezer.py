from bs4 import BeautifulSoup

html_content = """
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="col-span-full text-xl font-bold mb-4">Latest Switch Layouts</div>
    <a href="/layouts/two-row-12-game-icons-v20-123">
        <h3 class="mt-2 font-semibold text-lg">Two Row (12 Game Icons) (v20)</h3>
        <p class="text-sm text-gray-500">Home Menu</p>
    </a>
    <a href="/layouts/two-row-10-game-icons-v20-456">
        <h3 class="mt-2 font-semibold text-lg">Two Row (10 Game Icons) (v20)</h3>
        <p class="text-sm text-gray-500">Home Menu</p>
    </a>
    <a href="/layouts/2simple-player-select-789">
        <h3 class="mt-2 font-semibold text-lg">2Simple Player Select</h3>
        <p class="text-sm text-gray-500">Player Selection</p>
    </a>
    <a href="/layouts/2simple-settings-101">
        <h3 class="mt-2 font-semibold text-lg">2Simple Settings</h3>
        <p class="text-sm text-gray-500">Settings</p>
    </a>
    <a href="/layouts/2simple-two-row-202">
        <h3 class="mt-2 font-semibold text-lg">2Simple Two Row</h3>
        <p class="text-sm text-gray-500">Home Menu</p>
    </a>
</div>
"""

soup = BeautifulSoup(html_content, 'html.parser')

layouts_section = soup.find('div', string='Latest Switch Layouts').parent

layout_links = []
for link in layouts_section.find_all('a'):
    href = link.get('href')
    title = link.find('h3').text.strip()
    target = link.find('p').text.strip()
    layout_links.append({'title': title, 'target': target, 'href': href})

for layout in layout_links:
    print(f"Title: {layout['title']}, Target: {layout['target']}, URL: https://themezer.net{layout['href']}")
