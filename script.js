// 오늘 날짜를 기본값으로 설정
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('mealDate').value = formattedDate;
    
    // 페이지 로드 시 오늘 날짜의 급식 정보 조회
    getMealInfo();
});

async function getMealInfo() {
    const dateInput = document.getElementById('mealDate').value;
    const formattedDate = dateInput.replace(/-/g, '');
    
    // API URL 설정 (CORS 프록시 추가)
    const baseUrl = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=7061114&MLSV_YMD=${formattedDate}`;
    const apiUrl = `https://cors-anywhere.herokuapp.com/${baseUrl}`;
    
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Origin': 'http://localhost:3000'
            }
        });
        const data = await response.json();
        
        const mealContent = document.getElementById('mealContent');
        
        if (data.RESULT && data.RESULT.CODE === 'INFO-200') {
            mealContent.innerHTML = '해당 날짜의 급식 정보가 없습니다.';
            return;
        }
        
        if (data.mealServiceDietInfo && data.mealServiceDietInfo[1].row) {
            const mealInfo = data.mealServiceDietInfo[1].row[0];
            const mealDate = `${mealInfo.MLSV_YMD.slice(0, 4)}년 ${mealInfo.MLSV_YMD.slice(4, 6)}월 ${mealInfo.MLSV_YMD.slice(6, 8)}일`;
            const mealMenu = mealInfo.DDISH_NM.replace(/<br\/>/g, '\n');
            
            mealContent.innerHTML = `
                <p><strong>날짜:</strong> ${mealDate}</p>
                <p><strong>급식 메뉴:</strong></p>
                <p>${mealMenu}</p>
            `;
        } else {
            mealContent.innerHTML = '급식 정보를 불러오는데 실패했습니다.';
        }
    } catch (error) {
        console.error('Error fetching meal information:', error);
        document.getElementById('mealContent').innerHTML = '급식 정보를 불러오는데 실패했습니다. (CORS 오류가 발생했습니다. https://cors-anywhere.herokuapp.com/corsdemo 에서 임시 액세스를 활성화해주세요.)';
    }
}
