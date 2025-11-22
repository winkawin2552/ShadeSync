import cv2 as cv
import numpy as np

# อ่านภาพ
img = cv.imread("get_data_for_train/img/tile_R03_C04.png")

# แปลงเป็น HSV
hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)

# ----------------------------
# 🔻 ใส่ช่วงสีที่ต้องการ (ปรับได้)
# ตัวอย่าง: สีแดง
lower = np.array([0, 0, 54])
upper = np.array([179, 186, 255])
# ----------------------------

# mask = 255 เฉพาะ "ในช่วงสี"
mask = cv.inRange(hsv, lower, upper)

# กลับ mask → ได้ pixel "นอกช่วงสี"
mask_outside = cv.bitwise_not(mask)

# สำเนาภาพสำหรับแก้ไข
result = img.copy()

# ----------------------------
# 🔻 เปลี่ยนเฉพาะพิกเซล "นอกช่วงสี" เป็นสีเขียว
# สีเขียว BGR = (0, 255, 0)
result[mask_outside > 0] = (0, 255, 0)
# ----------------------------

# แสดงผล
cv.imshow("Original", img)
cv.imshow("Mask In Range", mask)
cv.imshow("Mask Outside", mask_outside)
cv.imshow("Result (Outside → Green)", result)

cv.waitKey(0)
cv.destroyAllWindows()